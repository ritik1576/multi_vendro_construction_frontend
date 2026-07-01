import { useMemo, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderDetailsRequest } from '../../redux/orderActions';
import { ChevronLeft, MapPin, CreditCard, Package, ArrowLeft, ArrowRight, Store } from 'lucide-react';

import ProductListingNavbar from '../../components/customer/catalog/ProductListingNavbar';
import OrderStatusProgress from '../../components/customer/OrderStatusProgress';
import { formatCurrency, getCartItemPrice } from '../../context/cartUtils';
import { useReviews } from '../../features/reviews/hooks/useReviews';
import { ReviewForm } from '../../features/reviews/components/ReviewForm';
import { Star } from 'lucide-react';
import { getOrderApiId, getDisplayOrderNumber } from '../../utils/orderHelpers';
import { useNavigate } from 'react-router-dom';

const getPaymentMethodLabel = (order) => {
  const payment = order?.paymentMethod;

  const method =
    typeof payment === "string"
      ? payment
      : payment?.method || payment?.name || "";

  const description =
    typeof payment === "object"
      ? payment?.description || ""
      : "";

  const status =
    typeof payment === "object"
      ? payment?.paymentStatus || ""
      : order?.paymentStatus || "";

  const methodLower = String(method).toLowerCase();
  const statusLower = String(status).toLowerCase();

  if (
    methodLower.includes("razorpay") ||
    methodLower.includes("online") ||
    methodLower.includes("upi")
  ) {
    return "Online Payment";
  }

  if (methodLower.includes("cod") || methodLower.includes("cash")) {
    return "Cash on Delivery";
  }

  if (methodLower.includes("wallet")) {
    return "Wallet";
  }

  if (statusLower === "paid") {
    return "Online Payment";
  }

  return description || "Not available";
};

const getPaymentStatusLabel = (order) => {
  const payment = order?.paymentMethod;
  return typeof payment === "object"
    ? payment?.paymentStatus
    : order?.paymentStatus;
};

function OrderDetail() {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orderDetails: currentOrder, loading, error } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.auth);

  const [reviewModalData, setReviewModalData] = useState(null);
  const [newlyReviewed, setNewlyReviewed] = useState({});
  const [toastMessage, setToastMessage] = useState(null);
  const { addReview, hasUserReviewedOrder } = useReviews();

  useEffect(() => {
    if (orderId) {
      if (typeof orderId === 'string' && orderId.startsWith('INF-')) {
        navigate('/orders', { replace: true });
        return;
      }
      dispatch(getOrderDetailsRequest(orderId));
    }
  }, [dispatch, orderId, navigate]);

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

  const displayOrder = currentOrder;

  const apiOrderId = getOrderApiId(displayOrder) || orderId;
  const displayOrderId = displayOrder?.orderNumber || displayOrder?.tracking?.orderNumber || (displayOrder?.id ? `INFR-LOCAL-${displayOrder.id}` : (displayOrder?._id ? `INFR-LOCAL-${displayOrder._id}` : `INFR-LOCAL-${apiOrderId}`));
  
  const cartItems = displayOrder?.items || [];
  const deliveryCharge = displayOrder?.amount?.delivery ?? ((cartItems.length > 0) ? (displayOrder?.shippingCharge ?? 99) : 0);
  const subtotal = displayOrder?.amount?.itemsSubtotal ?? displayOrder?.subtotal ?? cartItems.reduce((sum, item) => sum + (item.price || getCartItemPrice(item)) * (item.quantity || 1), 0);
  const grandTotal = displayOrder?.amount?.totalAmount || displayOrder?.totalAmount || displayOrder?.grandTotal || 0;
  const orderStatus = displayOrder?.displayStatus || displayOrder?.orderStatus || displayOrder?.status || 'Pending';

  const getStepIndex = (status) => {
    const s = String(status).toLowerCase();
    if (s.includes('pending')) return 0;
    if (s.includes('confirmed')) return 1;
    if (s.includes('shipped')) return 2;
    if (s.includes('delivered')) return 3;
    return 0;
  };
  
  const isCancelled = String(orderStatus).toLowerCase().includes('cancelled');
  const currentStep = getStepIndex(orderStatus);

  const vendors = useMemo(
    () => Array.from(new Set(cartItems.map((item) => item.vendorName || item.vendor).filter(Boolean))),
    [cartItems]
  );

  const displayVendorName = displayOrder?.vendorName || vendors[0] || 'InfraMart Verified Supplier';

  const handleReviewClick = (item) => {
    const userId = user?.id || user?.userId || user?._id || 'u1';
    const currOrderId = apiOrderId;
    
    let productId = '';
    if (typeof item === 'string') {
      productId = item;
    } else if (item) {
      productId = item.productId || item.product_id || item.product?.id || item.product?._id || item.id || item._id || item.item_id;
    }
    
    if (!productId) {
      productId = currOrderId || `prod_${Date.now()}`;
    }

    const isReviewedBackend = (typeof item === 'object' && item?.hasReviewed) || displayOrder?.hasReviewed;

    if (isReviewedBackend || newlyReviewed[`${currOrderId}_${productId}`] || hasUserReviewedOrder(userId, currOrderId, productId)) {
      setToastMessage("You have already reviewed this item.");
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    setReviewModalData({
      orderId: currOrderId,
      productId,
      vendorId: item?.vendorId || displayOrder?.vendorId || 'v1',
      customerName: user?.fullName || user?.name || 'Customer',
      productName: typeof item === 'string' ? `Product ${item}` : (item?.productName || item?.name || `Order #${currOrderId}`)
    });
  };

  const handleReviewSubmit = async (reviewData) => {
    const userId = user?.id || user?.userId || user?._id || 'u1';
    await addReview({
      ...reviewData,
      orderId: reviewModalData.orderId,
      vendorId: reviewModalData.vendorId,
      userId,
      customerName: reviewModalData.customerName,
      productName: reviewModalData.productName,
      isVerifiedPurchase: true
    });
    setNewlyReviewed(prev => ({ ...prev, [`${reviewModalData.orderId}_${reviewModalData.productId}`]: true }));
    setReviewModalData(null);
    setToastMessage('Review submitted successfully!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#0F172A]">
      <ProductListingNavbar />

      <main className="mx-auto max-w-7xl px-4 pb-12 pt-6 sm:px-6 lg:px-8">
        
        {/* Compact Top Navigation */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <Link to="/orders" className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
            <ArrowLeft className="h-4 w-4 text-slate-500" />
            Back to Orders
          </Link>
          <Link to="/products" className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1E3A8A] hover:bg-[#152e63] px-4 py-2 text-sm font-bold text-white transition-colors shadow-sm">
            <Package className="h-4 w-4 opacity-75" />
            Browse Products
          </Link>
        </div>

        {loading && <p className="text-center text-slate-500 py-10">Loading order details...</p>}
        {error && (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-lg font-bold text-[#0F172A]">Unable to load order details</p>
            <p className="mt-2 text-sm text-slate-500">Please check the order ID or try again later.</p>
          </div>
        )}
        {!loading && !error && !displayOrder && (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-lg font-bold text-[#0F172A]">Order not found</p>
            <p className="mt-2 text-sm text-slate-500">This order is not available.</p>
          </div>
        )}

        {!loading && displayOrder && (
          <>
            {/* Order Header Card */}
            <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-extrabold text-[#0F172A]">
                    Order #{displayOrderId || apiOrderId}
                  </h1>
                  <span className={`inline-flex items-center rounded bg-blue-50 px-2.5 py-0.5 text-[11px] font-extrabold tracking-wider uppercase ${isCancelled ? 'text-red-700 bg-red-50' : 'text-[#1E3A8A]'}`}>
                    {orderStatus}
                  </span>
                </div>
                <p className="text-[13px] font-medium text-slate-500">
                  Placed on {displayOrder?.createdAt ? new Date(displayOrder.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
              
              {/* LEFT COLUMN: SINGLE COMPACT CARD */}
              <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden h-fit">
                
                {/* 1. Ordered Items Section */}
                <div className="p-5 border-b border-slate-100">
                  <h2 className="text-[12px] font-extrabold uppercase tracking-widest text-slate-400 mb-4">Order Details</h2>
                  {cartItems.length === 0 ? (
                    <p className="text-sm text-slate-500">No items found.</p>
                  ) : (
                    <div className="space-y-4">
                      {cartItems.map((item) => {
                        const quantity = item.quantity || 1;

                        const backendLineTotal =
                          item.subtotal ||
                          item.totalPrice ||
                          item.lineTotal ||
                          (cartItems.length === 1 ? subtotal : null);

                        const actualUnitPrice =
                          item.unitPrice ||
                          item.orderPrice ||
                          item.discountPrice ||
                          item.pricePaid ||
                          (backendLineTotal ? backendLineTotal / quantity : null) ||
                          item.price;

                        const actualLineTotal =
                          backendLineTotal ||
                          actualUnitPrice * quantity;

                        return (
                          <div key={item.id} className="flex items-start gap-4">
                            {/* Product Thumbnail */}
                            <div className="h-16 w-16 shrink-0 rounded bg-slate-100 flex items-center justify-center border border-slate-200">
                              <Package className="h-6 w-6 text-slate-400" />
                            </div>
                            
                            {/* Product Info */}
                            <div className="flex-1 min-w-0 pt-0.5">
                              <h3 className="text-[14px] font-bold text-[#0F172A] truncate">
                                {item.productName || item.name || 'Product name not available'}
                              </h3>
                              <p className="text-[13px] text-slate-500 mt-1">
                                Qty: {quantity} × {formatCurrency(actualUnitPrice)}
                              </p>
                            </div>
                            
                            {/* Total Price & Action */}
                            <div className="text-right pt-0.5 flex flex-col items-end gap-2">
                              <p className="text-[14px] font-extrabold text-[#0F172A]">
                                {formatCurrency(actualLineTotal)}
                              </p>
                              {String(orderStatus).toLowerCase().includes('delivered') && (() => {
                                const userId = user?.id || user?.userId || user?._id || 'u1';
                                const currOrderId = apiOrderId;
                                
                                let pId = '';
                                if (typeof item === 'string') {
                                  pId = item;
                                } else if (item) {
                                  pId = item.productId || item.product_id || item.product?.id || item.product?._id || item.id || item._id || item.item_id;
                                }
                                if (!pId) pId = currOrderId || '1';
                                
                                const isReviewedBackend = (typeof item === 'object' && item?.hasReviewed) || displayOrder?.hasReviewed;
                                const isReviewedLocal = newlyReviewed[`${currOrderId}_${pId}`] || hasUserReviewedOrder(userId, currOrderId, pId);
                                const isReviewed = isReviewedBackend || isReviewedLocal;
                                
                                return isReviewed ? (
                                  <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1 mt-1 bg-emerald-50 px-2 py-1 rounded">
                                    <Star className="w-3 h-3 fill-current" />
                                    Review Submitted
                                  </span>
                                ) : (
                                  <button 
                                    onClick={() => handleReviewClick(item)}
                                    className="text-[11px] font-bold text-[#1E3A8A] hover:text-[#0F172A] transition-colors flex items-center gap-1 mt-1 bg-blue-50 px-2 py-1 rounded"
                                  >
                                    <Star className="w-3 h-3" />
                                    Rate & Review
                                  </button>
                                );
                              })()}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 2. Logistics Section (Address & Payment side-by-side) */}
                <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Delivery Address */}
                    <div className="flex gap-3">
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-100">
                        <MapPin className="h-4 w-4 text-[#EA580C]" />
                      </div>
                      <div>
                        <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">Delivery Address</h3>
                        <p className="text-[13px] font-bold text-[#0F172A]">
                          {displayOrder?.deliveryAddress?.contactName || displayOrder?.deliveryAddress?.name || 'Ravi Kumar'}
                        </p>
                        <p className="text-[13px] text-slate-600 mt-0.5 leading-relaxed">
                          {displayOrder?.deliveryAddress?.addressLine || displayOrder?.deliveryAddress?.line1 || 'Plot 22, Metro City Towers'}
                          <br />
                          {displayOrder?.deliveryAddress?.cityStatePincode || `${displayOrder?.deliveryAddress?.city || 'Bengaluru'}, ${displayOrder?.deliveryAddress?.state || 'Karnataka'} ${displayOrder?.deliveryAddress?.pincode || '560038'}`}
                        </p>
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div className="flex gap-3">
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100">
                        <CreditCard className="h-4 w-4 text-[#1E3A8A]" />
                      </div>
                      <div>
                        <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">Payment Method</h3>
                        <p className="text-[13px] font-bold text-[#0F172A]">
                          {getPaymentMethodLabel(displayOrder)}
                        </p>
                        <p className="text-[13px] text-slate-600 mt-0.5">
                          {String(getPaymentStatusLabel(displayOrder) || 'Pending').toLowerCase() === 'paid' || getPaymentMethodLabel(displayOrder) === 'Online Payment' ? 'Paid Online' : 'Pay at your doorstep'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Vendor Information */}
                <div className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm">
                      <Store className="h-5 w-5 text-slate-500" />
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-[#0F172A]">{displayVendorName}</p>
                      <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Verified Supplier</p>
                    </div>
                  </div>
                  <button className="text-[12px] font-bold text-[#1E3A8A] hover:underline">View Store</button>
                </div>

              </div>

              {/* RIGHT COLUMN: SIDEBAR */}
              <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
                
                {/* Order Summary Card */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h2 className="text-[12px] font-extrabold uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-100 pb-3">
                    Order Summary
                  </h2>
                  <div className="space-y-3 text-[13px] text-slate-600">
                    <div className="flex justify-between">
                      <span>Items Subtotal</span>
                      <span className="font-bold text-[#0F172A]">{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span className="font-bold text-[#0F172A]">{deliveryCharge ? formatCurrency(deliveryCharge) : 'Free'}</span>
                    </div>
                  </div>
                  <div className="mt-4 border-t border-slate-100 pt-4 flex items-center justify-between">
                    <span className="text-[14px] font-extrabold text-[#0F172A]">Total Amount</span>
                    <span className="text-[18px] font-extrabold text-[#EA580C]">{formatCurrency(grandTotal)}</span>
                  </div>
                </div>

                {/* Order Tracking Timeline */}
                <OrderStatusProgress currentStep={currentStep} isCancelled={isCancelled} />
                
              </aside>

            </div>
          </>
        )}
      </main>

      {/* Modals and Toasts */}
      {reviewModalData && (
        <ReviewForm 
          productId={reviewModalData.productId}
          onClose={() => setReviewModalData(null)}
          onSubmit={handleReviewSubmit}
        />
      )}

      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 bg-slate-800 text-white px-6 py-3 rounded shadow-lg text-sm font-medium animate-fade-in-up">
          {toastMessage}
        </div>
      )}
    </div>
  );
}

export default OrderDetail;

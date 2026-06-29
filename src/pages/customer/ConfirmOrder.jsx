import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProductListingNavbar from '../../components/customer/catalog/ProductListingNavbar';
import { formatCurrency } from '../../context/cartUtils';
import { orderService } from '../../services/orderService';

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

const ConfirmOrder = () => {
  const location = useLocation();
  const lastPlacedOrder = useSelector(state => state.order.lastPlacedOrder);
  
  const passedOrderData = location.state?.orderData;
  const passedOrderId = location.state?.orderId;

  const [backendOrder, setBackendOrder] = useState(null);
  const [loading, setLoading] = useState(!!passedOrderId);

  useEffect(() => {
    const fetchOrder = async () => {
      if (passedOrderId) {
        try {
          setLoading(true);
          const data = await orderService.getOrderById(passedOrderId);
          setBackendOrder(data);
        } catch (error) {
          console.error("Failed to fetch order details", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [passedOrderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <ProductListingNavbar />
        <div className="flex h-[60vh] items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#1E3A8A]"></div>
        </div>
      </div>
    );
  }

  // Determine display values
  let displayOrderId = 'Pending';
  let displayPaymentMethod = 'Cash on Delivery';
  let displayTotalAmount = 0;
  let displayAddress = {
    name: 'Customer',
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    phone: ''
  };
  let trackOrderId = 'INF-99824';

  if (backendOrder) {
    const orderData = backendOrder.data || backendOrder;
    const orderNum = orderData.orderNumber || orderData.tracking?.orderNumber || (orderData.id ? `INFR-LOCAL-${orderData.id}` : (orderData._id ? `INFR-LOCAL-${orderData._id}` : ''));
    displayOrderId = orderNum ? `Order #${orderNum}` : 'Order Confirmed';
    
    displayPaymentMethod = getPaymentMethodLabel(orderData);
    displayTotalAmount = orderData.amount?.totalAmount || orderData.totalAmount || orderData.grandTotal || 0;
    
    if (orderData.shippingAddress) {
      displayAddress = orderData.shippingAddress;
    }
    
    trackOrderId = orderData.id || orderData._id || orderData.orderNumber || 'INF-99824';
  } else {
    // Fallback for COD or if passedOrderData exists
    const fallbackOrderData = passedOrderData || {
      totalAmount: 45000,
      paymentMethod: 'cod',
      shippingAddress: {
        name: 'Ravi Kumar',
        line1: 'Plot 22, Metro City Towers',
        line2: 'Industrial Area, Sector 8',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560038',
        country: 'India',
        phone: '+91 98765 43210'
      }
    };

    displayOrderId = lastPlacedOrder?.id || lastPlacedOrder?._id || lastPlacedOrder?.orderId || 'Pending';
    displayTotalAmount = fallbackOrderData.totalAmount || fallbackOrderData.amount?.totalAmount || fallbackOrderData.grandTotal || 0;
    
    if (fallbackOrderData.paymentMethod === 'online') {
      displayPaymentMethod = 'Online Payment';
    } else if (fallbackOrderData.paymentMethod === 'wallet') {
      displayPaymentMethod = 'Wallet Payment';
    } else {
      displayPaymentMethod = 'Cash on Delivery';
    }
    
    displayAddress = fallbackOrderData.shippingAddress;
    trackOrderId = lastPlacedOrder?.id || lastPlacedOrder?._id || lastPlacedOrder?.orderId || 'INF-99824';
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <ProductListingNavbar />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-200">
          {/* Header Section */}
          <div className="bg-white px-8 py-12 text-center border-b border-slate-100">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
              <svg className="h-10 w-10 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 mb-2">Order Successful</p>
            <h1 className="text-3xl font-extrabold text-[#0F172A]">Your order is placed</h1>
            <p className="mt-3 text-sm text-slate-500">
              The order is being confirmed by the vendor.
            </p>
          </div>

          {/* Details Section */}
          <div className="p-8 sm:p-10 bg-[#F8FAFC]">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-xl bg-white p-6 border border-slate-200 shadow-sm space-y-6">
                <div>
                  <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Order Number</h3>
                  <p className="text-lg font-bold text-[#0F172A]">{displayOrderId}</p>
                </div>

                <div>
                  <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Payment Method</h3>
                  <div className="inline-flex items-center rounded bg-slate-100 px-3 py-1 text-[12px] font-bold text-slate-700">
                    {displayPaymentMethod}
                  </div>
                </div>
                
                <div className="pt-4 border-t border-slate-100">
                  <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Total Amount</h3>
                  <p className="text-2xl font-extrabold text-[#0F172A]">{formatCurrency(displayTotalAmount)}</p>
                </div>
              </div>

              <div className="rounded-xl bg-white p-6 border border-slate-200 shadow-sm">
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-4">Delivery Address</h3>
                <div className="space-y-1.5 text-[13px] text-slate-600">
                  <p className="text-[14px] font-bold text-[#0F172A] mb-2">{displayAddress?.name || ''}</p>
                  <p>{displayAddress?.line1 || ''}</p>
                  {displayAddress?.line2 && <p>{displayAddress.line2}</p>}
                  <p>{displayAddress?.city || ''}, {displayAddress?.state || ''} - {displayAddress?.pincode || ''}</p>
                  <p>{displayAddress?.country || ''}</p>
                  <p className="mt-3 font-semibold text-slate-700">Mobile: {displayAddress?.phone || ''}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
              <Link
                to={`/orders/${trackOrderId}`}
                className="inline-flex w-full items-center justify-center rounded bg-[#EA580C] px-8 py-3 text-[13px] font-bold tracking-wide text-white transition hover:bg-[#C2410C] sm:w-auto shadow-sm"
              >
                TRACK ORDER
              </Link>
              <Link
                to="/products"
                className="inline-flex w-full items-center justify-center rounded border border-slate-300 bg-white px-8 py-3 text-[13px] font-bold tracking-wide text-slate-700 transition hover:bg-slate-50 hover:text-slate-900 sm:w-auto shadow-sm"
              >
                CONTINUE SHOPPING
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmOrder;

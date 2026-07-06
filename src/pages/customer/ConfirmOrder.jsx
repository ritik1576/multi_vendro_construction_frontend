import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ProductListingNavbar from '../../components/customer/catalog/ProductListingNavbar';
import { formatCurrency } from '../../context/cartUtils';
import { orderService } from '../../services/orderService';

// Legacy helpers removed

const ConfirmOrder = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const orderId = searchParams.get('orderId');

  const [backendOrder, setBackendOrder] = useState(() => {
    try {
      const saved = sessionStorage.getItem("latestOrder");
      if (saved) {
        const parsed = JSON.parse(saved);
        const savedId = parsed?.id || parsed?.orderId || parsed?.data?.id;
        if (savedId && String(savedId) === String(orderId)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Failed to parse session storage", e);
    }
    return null;
  });

  const [loading, setLoading] = useState(!backendOrder && !!orderId);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (orderId) {
        try {
          if (!backendOrder) setLoading(true);
          const data = await orderService.getOrderById(orderId);
          setBackendOrder(data);
          sessionStorage.setItem("latestOrder", JSON.stringify(data));
        } catch (error) {
          console.error("Failed to fetch order details", error);
          if (!backendOrder) setError("Failed to load order details.");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        setError("Invalid order ID.");
      }
    };
    fetchOrder();
  }, [orderId]);

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

  if (error && !backendOrder) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <ProductListingNavbar />
        <div className="flex h-[60vh] items-center justify-center flex-col">
          <p className="text-red-500 font-bold mb-4">{error}</p>
          <Link to="/" className="text-[#1E3A8A] underline">Return Home</Link>
        </div>
      </div>
    );
  }

  // Determine display values
  let displayOrderId = '';
  let displayPaymentMethod = { title: '', desc: '' };
  let displayTotalAmount = 0;
  let displayAddress = {};
  let trackOrderId = '';

  const orderData = backendOrder ? (backendOrder.data || backendOrder) : null;
  
  if (orderData) {
    displayOrderId = orderData.orderNumber || orderData.id || '';
    displayTotalAmount = orderData.amount?.totalAmount || orderData.totalAmount || 0;
    
    if (orderData.deliveryAddress || orderData.shippingAddress) {
      displayAddress = orderData.deliveryAddress || orderData.shippingAddress;
    }
    
    const pm = orderData.paymentMethod || {};
    const pmMethod = typeof pm === 'string' ? pm : pm.method;
    const pmDescription = typeof pm === 'string' ? '' : pm.description;

    let pmTitle = pmMethod || '';
    let pmDesc = pmDescription || '';

    if (pmTitle === 'UPI') {
      pmTitle = 'UPI';
      pmDesc = pmDesc || 'Paid via UPI';
    } else if (pmTitle === 'COD' || pmTitle === 'Cash on Delivery') {
      pmTitle = 'Cash on Delivery';
      pmDesc = pmDesc || 'Pay on Delivery';
    } else if (pmTitle === 'WALLET' || pmTitle === 'Wallet') {
      pmTitle = 'Wallet';
      pmDesc = pmDesc || 'Paid using Wallet Balance';
    } else if (pmTitle === 'Online') {
      pmTitle = 'Online Payment';
      pmDesc = pmDesc || 'Paid securely online';
    }
    
    displayPaymentMethod = { title: pmTitle, desc: pmDesc };
    trackOrderId = orderData.orderNumber || orderData.id || '';
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
                  <p className="text-lg font-bold text-[#0F172A]">Order #{displayOrderId}</p>
                </div>

                <div>
                  <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Payment Method</h3>
                  <div className="inline-flex flex-col items-start justify-center rounded bg-slate-100 px-3 py-1.5">
                    <span className="text-[12px] font-bold text-slate-700">{displayPaymentMethod.title}</span>
                    {displayPaymentMethod.desc && <span className="text-[10px] text-slate-500">{displayPaymentMethod.desc}</span>}
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
                  {displayAddress?.contactName && <p className="text-[14px] font-bold text-[#0F172A] mb-2">{displayAddress.contactName}</p>}
                  {displayAddress?.addressLine && <p>{displayAddress.addressLine}</p>}
                  {displayAddress?.cityStatePincode && <p>{displayAddress.cityStatePincode}</p>}
                  {displayAddress?.contactPhone && <p className="mt-3 font-semibold text-slate-700">Mobile: {displayAddress.contactPhone}</p>}
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

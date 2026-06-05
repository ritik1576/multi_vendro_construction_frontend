import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../../components/landing/Navbar';

const ConfirmOrder = () => {
  const location = useLocation();
  const orderData = location.state?.orderData || {
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

  const isOnline = orderData.paymentMethod === 'online';

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] bg-white shadow-xl ring-1 ring-slate-200">
          {/* Header Section */}
          <div className="bg-[#0F172A] px-8 py-12 text-center text-white">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20 ring-8 ring-emerald-500/10">
              <svg className="h-10 w-10 text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-400">Order Successful</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Your order is placed</h1>
            <p className="mt-4 text-slate-300">
              The order is being confirmed by vendor
            </p>
          </div>

          {/* Details Section */}
          <div className="p-8 sm:p-10">
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-6">

                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Payment Method</h3>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-sky-50 px-3 py-1 text-sm font-medium text-sky-700 ring-1 ring-inset ring-sky-600/20">
                      {isOnline ? 'Paid Online' : 'Cash on Delivery'}
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex flex-col gap-1">
                  <h3 className="text-xs font-semibold uppercase text-gray-500">Total Amount</h3>
                  <p className="mt-1 text-3xl font-bold text-slate-900">₹{orderData.totalAmount}</p>
                </div>
              </div>

              <div className="rounded-[1.5rem] bg-slate-50 p-6 ring-1 ring-slate-200">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Delivery Address</h3>
                <div className="mt-4 space-y-1 text-sm text-slate-700">
                  <p className="font-semibold text-slate-900">{orderData.shippingAddress.name}</p>
                  <p>{orderData.shippingAddress.line1}</p>
                  {orderData.shippingAddress.line2 && <p>{orderData.shippingAddress.line2}</p>}
                  <p>{orderData.shippingAddress.city}, {orderData.shippingAddress.state} {orderData.shippingAddress.pincode}</p>
                  <p>{orderData.shippingAddress.country}</p>
                  <p className="mt-2 font-medium">{orderData.shippingAddress.phone}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
              <Link
                to={`/orders/${orderData.id || orderData._id || 'INF-99824'}`}
                className="inline-flex w-full items-center justify-center rounded-full bg-[#0F172A] px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#152e63] sm:w-auto"
              >
                Track Order
              </Link>
              <Link
                to="/products"
                className="inline-flex w-full items-center justify-center rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 transition hover:bg-slate-50 hover:text-slate-900 sm:w-auto"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmOrder;

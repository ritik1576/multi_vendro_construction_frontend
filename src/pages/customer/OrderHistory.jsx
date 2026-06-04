import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getOrdersRequest } from '../../redux/orderActions';
import Navbar from '../../components/landing/Navbar';

const badgeClass = (status) => {
  switch (status) {
    case 'Delivered':
      return 'bg-emerald-100 text-emerald-700';
    case 'Out for Delivery':
      return 'bg-sky-100 text-sky-700';
    case 'Confirmed':
      return 'bg-indigo-100 text-indigo-700';
    case 'Packed':
      return 'bg-orange-100 text-orange-700';
    case 'Vendor Confirmation Pending':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-slate-100 text-slate-700';
  }
};

const OrderHistory = () => {
  const dispatch = useDispatch();
  const { orders = [], loading, error } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.auth);

useEffect(() => {
  const userId = user?.id || user?._id;

  if (userId) {
    dispatch(getOrdersRequest(userId));
  }
}, [dispatch, user]);

  const hasOrders = !loading && !error && orders.length > 0;
  const showEmpty = !loading && !error && orders.length === 0;
  const showError = !loading && Boolean(error);

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-4 pb-10 pt-6 sm:px-6 lg:px-8">
      <Navbar />
      <div className="mx-auto max-w-7xl pt-6">
        <div className="mb-6 overflow-hidden rounded-[1.75rem] bg-[#0F172A] px-6 py-8 text-white shadow-sm sm:px-8 sm:py-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-orange-300">InfraMart</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight">Order History</h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-200">
                Review past procurement orders and open details for status, totals, and next steps.
              </p>
            </div>
            <nav className="text-sm text-slate-200/90" aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link to="/" className="font-medium text-orange-300 hover:text-white">Home</Link>
                </li>
                <li>/</li>
                <li className="font-semibold">Orders</li>
              </ol>
            </nav>
          </div>
        </div>

        <Link
          to="/products"
          className="mt-6 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-[#1E3A8A] hover:bg-slate-50"
        >
          ← Back to Products
        </Link>

        <div className="space-y-6">
          {loading && (
            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-8 text-center shadow-sm">
              <p className="text-sm font-medium text-slate-600">Loading orders...</p>
            </div>
          )}

          {showError && (
            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-sm">
              <p className="text-lg font-semibold text-[#0F172A]">Unable to load orders</p>
              <p className="mt-2 text-sm text-slate-600">Please try again later. If the issue persists, refresh the page or check back soon.</p>
            </div>
          )}

          {showEmpty && (
            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-8 text-center shadow-sm">
              <h2 className="text-xl font-extrabold text-[#0F172A]">No orders yet</h2>
              <p className="mt-2 text-sm text-slate-600">Start by browsing and adding items to your cart.</p>
            </div>
          )}

          {hasOrders && orders.map((order) => {
            const orderId = order.id || order._id;
            const orderDate = order.date || (order.createdAt
              ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
              : 'Unknown date');
            const orderTotal = order.totalAmount || order.total || 0;
            const itemsCount = order.itemsCount || (Array.isArray(order.items) ? order.items.length : Number(order.items || 0));
            const vendorName = order.vendorName || order.vendor || 'Vendor';

            return (
              <div key={orderId} className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
                <div className="grid gap-6 p-6 md:grid-cols-[1.8fr_0.9fr_0.9fr]">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
                      <span>{orderDate}</span>
                    </div>
                    <p className="text-xl font-semibold text-[#0F172A]">{vendorName}</p>
                    <p className="text-sm text-slate-500">Review order details and status</p>
                  </div>

                  <div className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Total</p>
                    <p className="text-2xl font-semibold text-[#1E3A8A]">₹{orderTotal}</p>
                    <p className="text-sm text-slate-500">{itemsCount} items</p>
                  </div>

                  <div className="flex flex-col items-start justify-between gap-4 text-right md:items-end">
                    <span className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${badgeClass(order.status || 'Processing')}`}>
                      {order.status || 'Processing'}
                    </span>
                    <Link
                      to={`/orders/${orderId}`}
                      className="inline-flex h-12 items-center justify-center rounded-full bg-[#1E3A8A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#152e63]"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;

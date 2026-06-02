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
    case 'Packed':
      return 'bg-orange-100 text-orange-700';
    default:
      return 'bg-slate-100 text-slate-700';
  }
};

const OrderHistory = () => {
  const dispatch = useDispatch();
  const { orders = [], loading, error } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(getOrdersRequest());
    
    const authActions = document.querySelector('nav .border-l');
    if (authActions) authActions.style.display = 'none';
    return () => {
      if (authActions) authActions.style.display = '';
    };
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-4 pb-10 pt-6 sm:px-6 lg:px-8">
      <Navbar />
      <div className="mx-auto max-w-7xl pt-6">
        <div className="mb-8 overflow-hidden rounded-[2rem] bg-[#0F172A] px-6 py-8 text-white shadow-sm sm:px-10 sm:py-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-300">InfraMart</p>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight">Order History</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-200">
                Review your order history and open details to check shipment progress and invoice information.
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

        <div className="space-y-6">
          {loading && <p className="text-center text-slate-500">Loading orders...</p>}
          {error && <p className="text-center text-red-500">Error loading orders.</p>}
          {!loading && !error && orders.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
              <h2 className="text-xl font-extrabold text-[#0F172A]">No orders found</h2>
              <p className="mt-2 text-sm text-slate-600">You haven't placed any orders yet.</p>
            </div>
          )}
          {!loading && !error && orders.map((order) => {
            const orderId = order.id || order._id;
            const orderDate = order.date || (order.createdAt && new Date(order.createdAt).toLocaleDateString()) || 'Unknown date';
            const orderTotal = order.totalAmount || order.total || 0;
            const itemsCount = (order.items && Array.isArray(order.items)) ? order.items.length : (order.items || 0);
            
            return (
            <div key={orderId} className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
              <div className="grid gap-6 p-6 md:grid-cols-[1.5fr_1fr_0.9fr] lg:grid-cols-[1.8fr_0.9fr_0.9fr] xl:grid-cols-[2fr_0.9fr_0.9fr]">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
                    <span>Order ID</span>
                    <span className="text-slate-300">•</span>
                    <span>{orderDate}</span>
                  </div>
                  <p className="text-xl font-semibold text-[#0F172A]">{orderId}</p>
                  <p className="text-sm text-slate-500">Order created on {orderDate}</p>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Amount</p>
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
          )})}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;

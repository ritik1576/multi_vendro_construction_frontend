import React from 'react';
import { Link } from 'react-router-dom';

const mockOrders = [
  {
    id: 'ORD-1001',
    date: '2026-05-28',
    status: 'Packed',
    total: 2697,
    items: 6,
  },
  {
    id: 'ORD-1002',
    date: '2026-05-22',
    status: 'Delivered',
    total: 1499,
    items: 3,
  },
  {
    id: 'ORD-1003',
    date: '2026-05-19',
    status: 'Out for Delivery',
    total: 2175,
    items: 5,
  },
];

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
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 overflow-hidden rounded-[2rem] bg-gradient-to-r from-orange-500 via-orange-400 to-sky-500 px-6 py-8 text-white shadow-lg sm:px-10 sm:py-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-100">InfraMart</p>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight">Order History</h1>
              <p className="mt-2 max-w-2xl text-sm text-orange-100/90">
                Review your order history and open details to check shipment progress and billing information.
              </p>
            </div>
            <nav className="text-sm text-orange-100/90" aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link to="/" className="font-medium text-orange-100 hover:text-white">Home</Link>
                </li>
                <li>/</li>
                <li className="font-semibold">Orders</li>
              </ol>
            </nav>
          </div>
        </div>

        <div className="space-y-6">
          {mockOrders.map((order) => (
            <div key={order.id} className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
              <div className="grid gap-6 p-6 md:grid-cols-[1.4fr_1fr] lg:grid-cols-[1.7fr_0.8fr_0.8fr] xl:grid-cols-[1.8fr_0.8fr_0.8fr]">
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Order ID</p>
                  <p className="text-lg font-semibold text-slate-900">{order.id}</p>
                  <p className="text-sm text-slate-500">Placed on {order.date}</p>
                  <div className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${badgeClass(order.status)}`}>
                    {order.status}
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Total</p>
                  <p className="text-lg font-semibold text-slate-900">₹{order.total}</p>
                  <p className="text-sm text-slate-500">{order.items} items</p>
                </div>

                <div className="flex items-end justify-between md:justify-end">
                  <Link
                    to={`/orders/${order.id}`}
                    className="inline-flex h-12 items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;

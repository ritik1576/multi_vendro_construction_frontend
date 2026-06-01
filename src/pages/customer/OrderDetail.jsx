import React from 'react';
import { Link, useParams } from 'react-router-dom';
import OrderStatusProgress from '../../components/customer/OrderStatusProgress';

const mockOrders = [
  {
    id: 'ORD-1001',
    date: '2026-05-28',
    status: 'Out for Delivery',
    paymentMethod: 'Card',
    paymentStatus: 'Paid',
    address: 'Plot 12, Brickfield Road, Sector 21, Chennai, Tamil Nadu 600021',
    items: [
      { id: 'P-324', name: 'Premium Cement Bag', qty: 2, unitPrice: 450 },
      { id: 'P-518', name: 'Steel Reinforcement Rods', qty: 4, unitPrice: 325 },
      { id: 'P-736', name: 'Heavy Duty Work Gloves', qty: 1, unitPrice: 299 },
    ],
    currentStep: 3,
  },
  {
    id: 'ORD-1002',
    date: '2026-05-22',
    status: 'Delivered',
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    address: '12A, Silver Lane, Ranchi, Jharkhand 834001',
    items: [
      { id: 'P-109', name: 'Construction Safety Helmet', qty: 1, unitPrice: 649 },
      { id: 'P-219', name: 'Industrial Paint Set', qty: 1, unitPrice: 850 },
    ],
    currentStep: 4,
  },
  {
    id: 'ORD-1003',
    date: '2026-05-19',
    status: 'Packed',
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'Pending',
    address: '33 Pearl Street, Ahmedabad, Gujarat 380001',
    items: [
      { id: 'P-440', name: 'Electric Angle Grinder', qty: 1, unitPrice: 1199 },
      { id: 'P-551', name: 'Heavy Duty Extension Cord', qty: 2, unitPrice: 475 },
    ],
    currentStep: 2,
  },
];

const OrderDetail = () => {
  const { id } = useParams();
  const order = mockOrders.find((item) => item.id === id) || mockOrders[0];
  const subTotal = order.items.reduce((sum, item) => sum + item.qty * item.unitPrice, 0);
  const shipping = 120;
  const orderTotal = subTotal + shipping;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 overflow-hidden rounded-[2rem] bg-gradient-to-r from-orange-500 via-orange-400 to-sky-500 px-6 py-8 text-white shadow-lg sm:px-10 sm:py-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-100">InfraMart</p>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight">Order Detail</h1>
              <p className="mt-2 max-w-2xl text-sm text-orange-100/90">
                Review shipment progress, itemized charges and payment status for your order.
              </p>
            </div>
            <nav className="text-sm text-orange-100/90" aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link to="/" className="font-medium text-orange-100 hover:text-white">Home</Link>
                </li>
                <li>/</li>
                <li>
                  <Link to="/orders" className="font-medium text-orange-100 hover:text-white">Orders</Link>
                </li>
                <li>/</li>
                <li className="font-semibold">{order.id}</li>
              </ol>
            </nav>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <section className="rounded-[1.75rem] bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Order overview</p>
                  <h2 className="mt-2 text-3xl font-semibold text-slate-900">{order.id}</h2>
                  <p className="mt-2 text-sm text-slate-500">Placed on {order.date}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    to="/orders"
                    className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
                  >
                    Back to Orders
                  </Link>
                  <button className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700">
                    Download Invoice
                  </button>
                  <button className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-slate-100">
                    Track Order
                  </button>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Order Status</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{order.status}</p>
                </div>
                <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Payment</p>
                  <p className="mt-2 text-sm text-slate-600">Method: {order.paymentMethod}</p>
                  <p className="mt-1 text-sm font-medium text-slate-900">{order.paymentStatus}</p>
                </div>
              </div>
            </section>

            <section className="rounded-[1.75rem] bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Delivery address</p>
                  <h2 className="mt-2 text-xl font-semibold text-slate-900">Shipping details</h2>
                </div>
              </div>
              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
                <p className="font-semibold text-slate-900">Recipient</p>
                <p className="mt-1">Site Manager, InfraMart Logistics</p>
                <p className="mt-1">{order.address}</p>
                <p className="mt-1">Phone: +91 98765 43210</p>
              </div>
            </section>

            <section className="rounded-[1.75rem] bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Items ordered</p>
                  <h2 className="mt-2 text-xl font-semibold text-slate-900">Order details</h2>
                </div>
                <p className="text-sm text-slate-500">{order.items.length} products</p>
              </div>
              <div className="overflow-hidden rounded-[1.5rem] border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-4 py-4 font-semibold">Item</th>
                      <th className="px-4 py-4 font-semibold">Qty</th>
                      <th className="px-4 py-4 font-semibold">Unit Price</th>
                      <th className="px-4 py-4 font-semibold">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {order.items.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="px-4 py-4 text-slate-900">{item.name}</td>
                        <td className="px-4 py-4 text-slate-600">{item.qty}</td>
                        <td className="px-4 py-4 text-slate-600">₹{item.unitPrice}</td>
                        <td className="px-4 py-4 text-slate-900">₹{item.qty * item.unitPrice}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-50 text-slate-900">
                    <tr>
                      <td className="px-4 py-4 font-semibold">Subtotal</td>
                      <td colSpan="3" className="px-4 py-4">₹{subTotal}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-4 font-semibold">Shipping</td>
                      <td colSpan="3" className="px-4 py-4">₹{shipping}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-4 font-semibold">Order Total</td>
                      <td colSpan="3" className="px-4 py-4 text-xl font-semibold">₹{orderTotal}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <OrderStatusProgress currentStep={order.currentStep} />

            <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-5">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Payment summary</p>
                <h2 className="mt-2 text-xl font-semibold text-slate-900">Payment details</h2>
              </div>
              <div className="space-y-4 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>Payment method</span>
                  <span className="font-medium text-slate-900">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment status</span>
                  <span className={`font-medium ${order.paymentStatus === 'Paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {order.paymentStatus}
                  </span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-4">
                  <span className="font-semibold text-slate-900">Total</span>
                  <span className="text-xl font-semibold text-slate-900">₹{orderTotal}</span>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;

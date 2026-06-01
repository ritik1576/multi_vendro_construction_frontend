import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const mockCart = [
  { id: 1, name: 'Premium Cement Bag', qty: 2, price: 450 },
  { id: 2, name: 'Industrial Paint Set', qty: 1, price: 1199 },
  { id: 3, name: 'Safety Helmet', qty: 3, price: 299 },
];

const Checkout = () => {
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const subTotal = mockCart.reduce((sum, item) => sum + item.qty * item.price, 0);
  const shipping = 99;
  const total = subTotal + shipping;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 overflow-hidden rounded-[2rem] bg-gradient-to-r from-orange-500 via-orange-400 to-sky-500 px-6 py-8 text-white shadow-lg sm:px-10 sm:py-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-100">InfraMart</p>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight">Checkout</h1>
              <p className="mt-2 max-w-2xl text-sm text-orange-100/90">
                Confirm delivery details and choose a payment option for your construction essentials.
              </p>
            </div>
            <nav className="text-sm text-orange-100/90" aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link to="/" className="font-medium text-orange-100 hover:text-white">Home</Link>
                </li>
                <li>/</li>
                <li className="font-semibold">Checkout</li>
              </ol>
            </nav>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
          <div className="space-y-6">
            <section className="rounded-[1.75rem] bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Delivery Address</p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-900">Shipping details</h2>
                </div>
                <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-700">Standard delivery</span>
              </div>
              <div className="space-y-4 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
                <div className="space-y-1">
                  <p className="text-lg font-semibold text-slate-900">Ravi Kumar</p>
                  <p className="text-sm text-slate-600">Plot 22, Metro City Towers</p>
                  <p className="text-sm text-slate-600">Industrial Area, Sector 8</p>
                  <p className="text-sm text-slate-600">Bengaluru, Karnataka 560038</p>
                  <p className="text-sm text-slate-600">+91 98765 43210</p>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                  <span className="rounded-full bg-white px-3 py-2 shadow-sm">Delivery window: 2-3 days</span>
                  <span className="rounded-full bg-white px-3 py-2 shadow-sm">Schedule today</span>
                </div>
              </div>
            </section>

            <section className="rounded-[1.75rem] bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Payment Method</p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-900">Select payment option</h2>
                </div>
                <span className="rounded-full bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-700">Recommended</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { value: 'cod', label: 'Cash on Delivery' },
                  { value: 'upi', label: 'UPI' },
                  { value: 'card', label: 'Card' },
                  { value: 'netbanking', label: 'Net Banking' },
                ].map((option) => (
                  <label
                    key={option.value}
                    className={`flex cursor-pointer items-center gap-4 rounded-3xl border px-4 py-4 transition ${paymentMethod === option.value ? 'border-sky-500 bg-sky-50 shadow-sm' : 'border-slate-200 bg-slate-50 hover:border-slate-300'}`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={option.value}
                      checked={paymentMethod === option.value}
                      onChange={() => setPaymentMethod(option.value)}
                      className="h-5 w-5 accent-orange-500"
                    />
                    <span className="text-sm font-semibold text-slate-900">{option.label}</span>
                  </label>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-[1.75rem] bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Order summary</p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-900">Your cart</h2>
                </div>
                <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-700">{mockCart.length} items</span>
              </div>

              <div className="mt-6 space-y-4">
                {mockCart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4">
                    <div>
                      <p className="font-semibold text-slate-900">{item.name}</p>
                      <p className="text-sm text-slate-500">Qty {item.qty}</p>
                    </div>
                    <p className="font-semibold text-slate-900">₹{item.qty * item.price}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-3 rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>₹{shipping}</span>
                </div>
              </div>

              <div className="mt-6 rounded-[1.5rem] bg-gradient-to-r from-orange-500 to-sky-600 px-5 py-5 text-white shadow-lg">
                <div className="flex items-center justify-between text-sm uppercase tracking-[0.18em] opacity-90">Total</div>
                <div className="mt-3 flex items-end justify-between gap-4">
                  <span className="text-sm font-medium opacity-90">Order amount</span>
                  <span className="text-3xl font-semibold">₹{total}</span>
                </div>
              </div>

              <button className="mt-6 w-full rounded-[1.5rem] bg-orange-600 px-5 py-4 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700">
                Place Order
              </button>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

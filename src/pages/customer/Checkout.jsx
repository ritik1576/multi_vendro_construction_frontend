import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { placeOrderRequest } from '../../redux/orderActions';
import { getCartItemPrice } from '../../context/cartUtils';
import Navbar from '../../components/landing/Navbar';

const requiredFields = ['name', 'phone', 'line1', 'city', 'state', 'pincode'];

const initialAddress = {
  name: 'Ravi Kumar',
  phone: '+91 98765 43210',
  line1: 'Plot 22, Metro City Towers',
  line2: 'Industrial Area, Sector 8',
  city: 'Bengaluru',
  state: 'Karnataka',
  pincode: '560038',
  country: 'India',
  addressType: 'Site',
};

const validateAddress = (address) => {
  const errors = {};
  requiredFields.forEach((field) => {
    if (!address[field] || !address[field].toString().trim()) {
      errors[field] = true;
    }
  });
  return errors;
};

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [address, setAddress] = useState(initialAddress);
  const [draftAddress, setDraftAddress] = useState(initialAddress);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressErrors, setAddressErrors] = useState({});

  const cart = useSelector((state) => state.cart.cart);
  const cartItems = Array.isArray(cart)
    ? cart
    : Array.isArray(cart?.items)
    ? cart.items
    : [];

  const subTotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + (item.quantity || 1) * getCartItemPrice(item), 0),
    [cartItems]
  );
  const shipping = cartItems.length > 0 ? 99 : 0;
  const total = subTotal + shipping;

  const isAddressValid = Object.keys(validateAddress(address)).length === 0;
  const canPlaceOrder = cartItems.length > 0 && isAddressValid && !isEditingAddress;

  const handleFieldChange = (field, value) => {
    setDraftAddress((prev) => ({ ...prev, [field]: value }));
    if (addressErrors[field]) {
      setAddressErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleBeginEdit = () => {
    setDraftAddress(address);
    setAddressErrors({});
    setIsEditingAddress(true);
  };

  const handleCancelEdit = () => {
    setDraftAddress(address);
    setAddressErrors({});
    setIsEditingAddress(false);
  };

  const handleSaveAddress = () => {
    const errors = validateAddress(draftAddress);
    if (Object.keys(errors).length > 0) {
      setAddressErrors(errors);
      return;
    }
    setAddress(draftAddress);
    setIsEditingAddress(false);
    setAddressErrors({});
  };

  const handlePlaceOrder = () => {
    if (!canPlaceOrder) {
      return;
    }

    const orderData = {
      items: cartItems,
      shippingAddress: address,
      paymentMethod,
      subtotal: subTotal,
      shippingCharge: shipping,
      totalAmount: total,
    };

    dispatch(placeOrderRequest(orderData));
    navigate('/orders');
  };

  useEffect(() => {
    // Hide specific nav links on checkout page
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

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="mb-6 overflow-hidden rounded-[1.75rem] bg-[#0F172A] px-6 py-8 text-white shadow-sm sm:px-8 sm:py-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-orange-300">InfraMart</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight">Checkout</h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-200">
                Complete your procurement order with a compact, business-ready checkout experience.
              </p>
            </div>
            <nav className="text-sm text-slate-200/90" aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link to="/" className="font-medium text-orange-300 hover:text-white">Home</Link>
                </li>
                <li>/</li>
                <li className="font-semibold">Checkout</li>
              </ol>
            </nav>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.65fr_1fr]">
          <div className="space-y-6">
            <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Delivery address</p>
                  <h2 className="mt-2 text-2xl font-semibold text-[#0F172A]">Address details</h2>
                </div>
                <button
                  type="button"
                  onClick={handleBeginEdit}
                  className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-[#0F172A] transition hover:border-slate-400"
                >
                  Edit Address
                </button>
              </div>

              <div className="grid gap-4 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
                {isEditingAddress ? (
                  <div className="grid gap-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="space-y-2 text-sm text-slate-700">
                        <span>Name</span>
                        <input
                          value={draftAddress.name}
                          onChange={(e) => handleFieldChange('name', e.target.value)}
                          className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${addressErrors.name ? 'border-red-400 bg-red-50' : 'border-slate-300 bg-white'}`}
                        />
                      </label>
                      <label className="space-y-2 text-sm text-slate-700">
                        <span>Phone</span>
                        <input
                          value={draftAddress.phone}
                          onChange={(e) => handleFieldChange('phone', e.target.value)}
                          className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${addressErrors.phone ? 'border-red-400 bg-red-50' : 'border-slate-300 bg-white'}`}
                        />
                      </label>
                    </div>

                    <label className="space-y-2 text-sm text-slate-700">
                      <span>Address line 1</span>
                      <input
                        value={draftAddress.line1}
                        onChange={(e) => handleFieldChange('line1', e.target.value)}
                        className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${addressErrors.line1 ? 'border-red-400 bg-red-50' : 'border-slate-300 bg-white'}`}
                      />
                    </label>

                    <label className="space-y-2 text-sm text-slate-700">
                      <span>Address line 2</span>
                      <input
                        value={draftAddress.line2}
                        onChange={(e) => handleFieldChange('line2', e.target.value)}
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none"
                      />
                    </label>

                    <div className="grid gap-4 sm:grid-cols-3">
                      <label className="space-y-2 text-sm text-slate-700">
                        <span>City</span>
                        <input
                          value={draftAddress.city}
                          onChange={(e) => handleFieldChange('city', e.target.value)}
                          className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${addressErrors.city ? 'border-red-400 bg-red-50' : 'border-slate-300 bg-white'}`}
                        />
                      </label>
                      <label className="space-y-2 text-sm text-slate-700">
                        <span>State</span>
                        <input
                          value={draftAddress.state}
                          onChange={(e) => handleFieldChange('state', e.target.value)}
                          className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${addressErrors.state ? 'border-red-400 bg-red-50' : 'border-slate-300 bg-white'}`}
                        />
                      </label>
                      <label className="space-y-2 text-sm text-slate-700">
                        <span>Pincode</span>
                        <input
                          value={draftAddress.pincode}
                          onChange={(e) => handleFieldChange('pincode', e.target.value)}
                          className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${addressErrors.pincode ? 'border-red-400 bg-red-50' : 'border-slate-300 bg-white'}`}
                        />
                      </label>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="space-y-2 text-sm text-slate-700">
                        <span>Country</span>
                        <input
                          value={draftAddress.country}
                          readOnly
                          className="w-full rounded-xl border border-slate-300 bg-slate-100 px-4 py-3 text-sm text-slate-600 outline-none"
                        />
                      </label>
                      <label className="space-y-2 text-sm text-slate-700">
                        <span>Address Type</span>
                        <select
                          value={draftAddress.addressType}
                          onChange={(e) => handleFieldChange('addressType', e.target.value)}
                          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none"
                        >
                          <option value="Home">Home</option>
                          <option value="Office">Office</option>
                          <option value="Site">Site</option>
                          <option value="Warehouse">Warehouse</option>
                        </select>
                      </label>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveAddress}
                        className="inline-flex items-center justify-center rounded-full bg-[#0F172A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#152e63]"
                      >
                        Save Address
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <p className="text-lg font-semibold text-[#0F172A]">{address.name}</p>
                      <p className="text-sm text-slate-600">{address.line1}</p>
                      <p className="text-sm text-slate-600">{address.line2}</p>
                      <p className="text-sm text-slate-600">{address.city}, {address.state} {address.pincode}</p>
                      <p className="text-sm text-slate-600">{address.country}</p>
                      <p className="text-sm text-slate-600">{address.phone}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{address.addressType}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                      <span className="rounded-full bg-white px-3 py-2 shadow-sm">Procurement delivery</span>
                      <span className="rounded-full bg-white px-3 py-2 shadow-sm">Business address</span>
                    </div>
                  </div>
                )}
              </div>
            </section>

            <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Payment method</p>
                  <h2 className="mt-2 text-2xl font-semibold text-[#0F172A]">Choose payment option</h2>
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
                    className={`flex cursor-pointer items-center gap-4 rounded-3xl border px-4 py-4 transition ${paymentMethod === option.value ? 'border-[#0F172A] bg-white shadow-sm' : 'border-slate-300 bg-white hover:border-slate-400'}`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={option.value}
                      checked={paymentMethod === option.value}
                      onChange={() => setPaymentMethod(option.value)}
                      className="h-5 w-5 accent-[#0F172A]"
                    />
                    <span className="text-sm font-semibold text-[#0F172A]">{option.label}</span>
                  </label>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Order summary</p>
                  <h2 className="mt-2 text-2xl font-semibold text-[#0F172A]">Order Summary</h2>
                </div>
                <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-700">{cartItems.length} items</span>
              </div>

              <div className="mt-6 space-y-4">
                {cartItems.length === 0 ? (
                  <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-8 text-center">
                    <p className="text-lg font-semibold text-[#0F172A]">Your cart is empty</p>
                    <p className="mt-2 text-sm text-slate-600">Add products to continue with procurement checkout.</p>
                    <Link
                      to="/products"
                      className="mt-5 inline-flex rounded-full bg-[#0F172A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#152e63]"
                    >
                      Continue Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item) => {
                      const unitPrice = getCartItemPrice(item);
                      return (
                        <div key={item.id || item._id} className="grid gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 sm:grid-cols-[1fr_auto]">
                          <div>
                            <p className="font-semibold text-slate-900">{item.name || item.title}</p>
                            <p className="mt-1 text-sm text-slate-500">Qty {item.quantity || 1} × ₹{unitPrice}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-slate-500">Item subtotal</p>
                            <p className="mt-1 text-lg font-semibold text-[#0F172A]">₹{(item.quantity || 1) * unitPrice}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {cartItems.length > 0 && (
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
              )}

              <div className="mt-6 rounded-[1.5rem] border border-slate-200 bg-white px-5 py-6 shadow-sm">
                <div className="flex items-center justify-between text-sm uppercase tracking-[0.18em] text-slate-500">
                  <span>Total</span>
                  <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-orange-700">InfraMart</span>
                </div>
                <div className="mt-4 flex items-end justify-between gap-4">
                  <span className="text-sm font-medium text-slate-600">Order amount</span>
                  <span className="text-3xl font-semibold text-[#0F172A]">₹{total}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={!canPlaceOrder}
                className={`mt-6 w-full rounded-[1.5rem] px-5 py-4 text-sm font-semibold text-white shadow-sm transition ${canPlaceOrder ? 'bg-[#0F172A] hover:bg-[#152e63]' : 'cursor-not-allowed bg-slate-400'}`}
              >
                Place Order
              </button>
              {!canPlaceOrder && (
                <p className="mt-3 text-sm text-slate-500">
                  {cartItems.length === 0
                    ? 'Add items to enable checkout.'
                    : isEditingAddress
                    ? 'Save your updated address before placing the order.'
                    : 'Complete all required address fields to place the order.'}
                </p>
              )}
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

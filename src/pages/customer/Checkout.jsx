import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { placeOrderRequest } from '../../redux/orderActions';
import { getCartRequest } from '../../redux/cartActions';
import { getCartItemPrice, formatCurrency } from '../../context/cartUtils';
import { addressService } from '../../services/addressService';
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
  addressType: 'Home',
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
  const authUser = useSelector((state) => state.auth.user);
  
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [addresses, setAddresses] = useState([]);
  const [address, setAddress] = useState(null);
  const [draftAddress, setDraftAddress] = useState(initialAddress);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressErrors, setAddressErrors] = useState({});
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchAddresses = async () => {
      setIsLoadingAddresses(true);
      try {
        const userId = authUser?.id || authUser?.userId || authUser?._id || 21;
        const response = await addressService.getUserAddresses(userId);
        const fetchedAddresses = Array.isArray(response) ? response : (response.data || []);
        
        const mappedAddresses = fetchedAddresses.map(addr => ({
          id: addr.id,
          name: addr.fullName,
          phone: addr.phone,
          line1: addr.addressLine1,
          line2: addr.addressLine2 || '',
          city: addr.city,
          state: addr.state,
          pincode: addr.postalCode,
          country: addr.country || 'India',
          addressType: addr.addressType || 'Home',
          isDefault: addr.isDefault
        }));

        setAddresses(mappedAddresses);
        
        if (mappedAddresses.length > 0) {
          const defaultAddr = mappedAddresses.find(a => a.isDefault) || mappedAddresses[0];
          setAddress(defaultAddr);
        }
      } catch (err) {
        console.error("Failed to fetch addresses:", err);
      } finally {
        setIsLoadingAddresses(false);
      }
    };

    if (authUser) {
      fetchAddresses();
    }
  }, [authUser]);

  const cart = useSelector((state) => state.cart.cart);
  
  useEffect(() => {
    dispatch(getCartRequest());
  }, [dispatch]);

  const cartItems = Array.isArray(cart) ? cart : (cart?.data?.items || cart?.items || []);
  const subTotal = cart?.data?.totalPrice || cart?.totalPrice || cartItems.reduce((sum, item) => sum + getCartItemPrice(item) * (item.quantity || 1), 0);
  const discount = cart?.data?.discount || cart?.discount || 0;
  const deliveryCharge = cart?.data?.deliveryCharge || cart?.deliveryCharge || (cartItems.length > 0 ? 99 : 0);
  const total = cart?.data?.grandTotal || cart?.grandTotal || (subTotal - discount + deliveryCharge);

  const isAddressValid = address !== null && Object.keys(validateAddress(address)).length === 0;
  const canPlaceOrder = cartItems.length > 0 && isAddressValid && !isEditingAddress && !isLoadingAddresses;

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
    setDraftAddress(initialAddress);
    setAddressErrors({});
    setIsEditingAddress(true);
  };

  const handleEditAddress = (addr) => {
    setDraftAddress(addr);
    setAddressErrors({});
    setIsEditingAddress(true);
  };

  const handleDeleteAddress = async (id) => {
    try {
      await addressService.deleteAddress(id);
      setAddresses(prev => prev.filter(a => a.id !== id));
      if (address?.id === id) {
        setAddress(null);
      }
    } catch (err) {
      console.error("Failed to delete address:", err);
    }
  };

  const handleCancelEdit = () => {
    setDraftAddress(address);
    setAddressErrors({});
    setIsEditingAddress(false);
  };

  const handleSaveAddress = async () => {
    const errors = validateAddress(draftAddress);
    if (Object.keys(errors).length > 0) {
      setAddressErrors(errors);
      return;
    }
    
    try {
      const payload = {
        userID: authUser?.id || authUser?.userId || authUser?._id || 21,
        fullName: draftAddress.name,
        phone: draftAddress.phone,
        addressLine1: draftAddress.line1,
        addressLine2: draftAddress.line2 || "",
        isDefault: true,
        addressType: draftAddress.addressType.toLowerCase(),
        postalCode: draftAddress.pincode,
        country: draftAddress.country,
        state: draftAddress.state,
        city: draftAddress.city
      };
      
      let responseData;
      if (draftAddress.id) {
        const response = await addressService.updateAddress(draftAddress.id, payload);
        responseData = response.data || response;
      } else {
        const response = await addressService.createAddress(payload);
        responseData = response.data || response;
      }
      
      const savedAddress = {
        id: responseData.id || draftAddress.id,
        name: responseData.fullName,
        phone: responseData.phone,
        line1: responseData.addressLine1,
        line2: responseData.addressLine2 || '',
        city: responseData.city,
        state: responseData.state,
        pincode: responseData.postalCode,
        country: responseData.country || 'India',
        addressType: responseData.addressType || 'Home',
        isDefault: responseData.isDefault
      };
      
      setAddresses(prev => {
        if (draftAddress.id) {
          return prev.map(a => a.id === draftAddress.id ? savedAddress : a);
        }
        return [...prev, savedAddress];
      });
      setAddress(savedAddress);
      setIsEditingAddress(false);
      setAddressErrors({});
    } catch (err) {
      console.error("Failed to save address:", err);
    }
  };

  const handlePlaceOrder = () => {
    if (!canPlaceOrder || !address) {
      return;
    }

    const orderData = {
      userId: authUser?.id || authUser?.userId || authUser?._id || 21,
      addressId: address.id,
      items: cartItems.map(item => ({
        cartItemId: item.cartItemId || item.id,
        productId: item.productId || item.productID || item.id,
        quantity: item.quantity || 1
      }))
    };

    dispatch(placeOrderRequest(orderData));
    navigate('/order-confirmation', { state: { orderData } });
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
                  Add Address
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
                  <div className="space-y-4">
                    {isLoadingAddresses ? (
                      <div className="animate-pulse space-y-3">
                        <div className="h-4 w-1/3 rounded bg-slate-200"></div>
                        <div className="h-4 w-2/3 rounded bg-slate-200"></div>
                        <div className="h-4 w-1/2 rounded bg-slate-200"></div>
                      </div>
                    ) : addresses.length === 0 ? (
                      <div className="text-center py-4">
                        <p className="text-sm text-slate-500">No addresses found.</p>
                        <button type="button" onClick={handleBeginEdit} className="mt-3 text-sm font-semibold text-[#1E3A8A] hover:underline">
                          + Add a new address
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="relative">
                          <button 
                            type="button"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="inline-flex w-full items-center justify-between rounded-full bg-[#0F172A] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#152e63]"
                          >
                            Select Address
                            <svg className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          
                          {isDropdownOpen && (
                            <div className="absolute z-10 mt-2 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
                              <div className="max-h-60 overflow-y-auto">
                                {addresses.map(addr => (
                                  <button
                                    key={addr.id}
                                    type="button"
                                    onClick={() => {
                                      setAddress(addr);
                                      setAddressErrors({});
                                      setIsDropdownOpen(false);
                                    }}
                                    className={`w-full border-b border-slate-100 px-5 py-3 text-left text-sm transition last:border-0 hover:bg-slate-50 ${address?.id === addr.id ? 'bg-slate-50 font-semibold text-[#0F172A]' : 'text-slate-600'}`}
                                  >
                                    <div className="flex justify-between">
                                      <span>{addr.name}</span>
                                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">{addr.addressType}</span>
                                    </div>
                                    <p className="mt-1 text-xs text-slate-500">{addr.line1}, {addr.city}</p>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        {address && (
                          <div className="rounded-xl border border-[#0F172A] bg-slate-50 p-4 shadow-sm">
                            <p className="text-base font-semibold text-[#0F172A]">{address.name}</p>
                            <p className="mt-1 text-sm text-slate-600">{address.line1}</p>
                            {address.line2 && <p className="text-sm text-slate-600">{address.line2}</p>}
                            <p className="text-sm text-slate-600">{address.city}, {address.state} {address.pincode}</p>
                            <p className="text-sm text-slate-600">{address.country}</p>
                            <p className="mt-1 text-sm font-medium text-slate-700">{address.phone}</p>
                            <div className="mt-3 flex flex-wrap gap-2">
                              <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">{address.addressType}</span>
                            </div>
                            <div className="mt-4 flex flex-wrap gap-3 border-t border-slate-200 pt-3">
                              <button
                                type="button"
                                onClick={() => handleEditAddress(address)}
                                className="text-sm font-semibold text-[#1E3A8A] transition hover:text-[#0F172A] hover:underline"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteAddress(address.id)}
                                className="text-sm font-semibold text-red-500 transition hover:text-red-700 hover:underline"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
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
                  { value: 'online', label: 'Pay Online' },
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
                        <div key={item.cartItemId || item.id || item._id} className="grid gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 sm:grid-cols-[1fr_auto]">
                          <div>
                            <p className="font-semibold text-slate-900">{item.productName || item.name || item.title}</p>
                            <p className="mt-1 text-sm text-slate-500">Qty {item.quantity || 1} × {formatCurrency(unitPrice)}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-slate-500">Item subtotal</p>
                            <p className="mt-1 text-lg font-semibold text-[#0F172A]">{formatCurrency((item.quantity || 1) * unitPrice)}</p>
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
                    <span className="font-semibold text-slate-900">{formatCurrency(subTotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between">
                      <span>Discount</span>
                      <span className="font-semibold text-emerald-700">-{formatCurrency(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Delivery charge</span>
                    <span className="font-semibold text-slate-900">{deliveryCharge ? formatCurrency(deliveryCharge) : 'Free'}</span>
                  </div>
                </div>
              )}

              <div className="mt-6 rounded-[1.5rem] border border-slate-200 bg-white px-5 py-6 shadow-sm">
                <div className="flex items-center justify-between text-sm uppercase tracking-[0.18em] text-slate-500">
                  <span>Grand Total</span>
                  <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-orange-700">InfraMart</span>
                </div>
                <div className="mt-4 flex items-end justify-between gap-4">
                  <span className="text-sm font-medium text-slate-600">Order amount</span>
                  <span className="text-3xl font-semibold text-[#0F172A]">{formatCurrency(total)}</span>
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

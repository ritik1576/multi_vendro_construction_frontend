import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { placeOrderRequest } from '../../redux/orderActions';
import { getCartRequest } from '../../redux/cartActions';
import { getCartItemPrice, formatCurrency } from '../../context/cartUtils';
import { addressService } from '../../services/addressService';
import ProductListingNavbar from '../../components/customer/catalog/ProductListingNavbar';

const requiredFields = ['name', 'phone', 'line1', 'city', 'state', 'pincode'];

const initialAddress = {
  name: '',
  phone: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  pincode: '',
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

    const orderPayload = {
      userId: authUser?.id || authUser?.userId || authUser?._id || 21,
      addressId: address.id,
      items: cartItems.map(item => ({
        cartItemId: item.cartItemId || item.id,
        productId: item.productId || item.productID || item.id,
        quantity: item.quantity || 1
      }))
    };

    dispatch(placeOrderRequest(orderPayload));
    
    const confirmationData = {
      totalAmount: total,
      paymentMethod: paymentMethod,
      shippingAddress: {
        name: address.name,
        line1: address.line1,
        line2: address.line2,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        country: address.country,
        phone: address.phone
      }
    };
    navigate('/order-confirmation', { state: { orderData: confirmationData } });
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
      <ProductListingNavbar />
      <div className="mx-auto max-w-7xl px-4 pb-8 pt-6 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px] items-start">
          <div className="space-y-10">
            <section>
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4">
                <h2 className="text-[22px] font-bold text-[#0F172A]">Select Delivery Address</h2>
                <button
                  type="button"
                  onClick={handleBeginEdit}
                  className="inline-flex items-center justify-center rounded border border-slate-300 bg-white px-4 py-2.5 text-[11px] font-extrabold uppercase tracking-wider text-[#1E3A8A] transition hover:bg-slate-50"
                >
                  ADD NEW ADDRESS
                </button>
              </div>

              <div className="grid gap-4">
                {isEditingAddress ? (
                  <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-[#0F172A] mb-4">{draftAddress.id ? 'Edit Address' : 'Add New Address'}</h3>
                    <div className="grid gap-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <label className="space-y-2 text-sm text-slate-700 font-medium">
                          <span>Name</span>
                          <input
                            value={draftAddress.name}
                            onChange={(e) => handleFieldChange('name', e.target.value)}
                            className={`w-full rounded border px-4 py-3 text-sm outline-none transition focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A] ${addressErrors.name ? 'border-red-400 bg-red-50' : 'border-slate-300 bg-white'}`}
                          />
                        </label>
                        <label className="space-y-2 text-sm text-slate-700 font-medium">
                          <span>Phone</span>
                          <input
                            value={draftAddress.phone}
                            onChange={(e) => handleFieldChange('phone', e.target.value)}
                            className={`w-full rounded border px-4 py-3 text-sm outline-none transition focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A] ${addressErrors.phone ? 'border-red-400 bg-red-50' : 'border-slate-300 bg-white'}`}
                          />
                        </label>
                      </div>

                      <label className="space-y-2 text-sm text-slate-700 font-medium">
                        <span>Address line 1</span>
                        <input
                          value={draftAddress.line1}
                          onChange={(e) => handleFieldChange('line1', e.target.value)}
                          className={`w-full rounded border px-4 py-3 text-sm outline-none transition focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A] ${addressErrors.line1 ? 'border-red-400 bg-red-50' : 'border-slate-300 bg-white'}`}
                        />
                      </label>

                      <label className="space-y-2 text-sm text-slate-700 font-medium">
                        <span>Address line 2</span>
                        <input
                          value={draftAddress.line2}
                          onChange={(e) => handleFieldChange('line2', e.target.value)}
                          className="w-full rounded border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A]"
                        />
                      </label>

                      <div className="grid gap-4 sm:grid-cols-3">
                        <label className="space-y-2 text-sm text-slate-700 font-medium">
                          <span>City</span>
                          <input
                            value={draftAddress.city}
                            onChange={(e) => handleFieldChange('city', e.target.value)}
                            className={`w-full rounded border px-4 py-3 text-sm outline-none transition focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A] ${addressErrors.city ? 'border-red-400 bg-red-50' : 'border-slate-300 bg-white'}`}
                          />
                        </label>
                        <label className="space-y-2 text-sm text-slate-700 font-medium">
                          <span>State</span>
                          <input
                            value={draftAddress.state}
                            onChange={(e) => handleFieldChange('state', e.target.value)}
                            className={`w-full rounded border px-4 py-3 text-sm outline-none transition focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A] ${addressErrors.state ? 'border-red-400 bg-red-50' : 'border-slate-300 bg-white'}`}
                          />
                        </label>
                        <label className="space-y-2 text-sm text-slate-700 font-medium">
                          <span>Pincode</span>
                          <input
                            value={draftAddress.pincode}
                            onChange={(e) => handleFieldChange('pincode', e.target.value)}
                            className={`w-full rounded border px-4 py-3 text-sm outline-none transition focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A] ${addressErrors.pincode ? 'border-red-400 bg-red-50' : 'border-slate-300 bg-white'}`}
                          />
                        </label>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <label className="space-y-2 text-sm text-slate-700 font-medium">
                          <span>Country</span>
                          <input
                            value={draftAddress.country}
                            readOnly
                            className="w-full rounded border border-slate-300 bg-slate-100 px-4 py-3 text-sm text-slate-600 outline-none"
                          />
                        </label>
                        <label className="space-y-2 text-sm text-slate-700 font-medium">
                          <span>Address Type</span>
                          <select
                            value={draftAddress.addressType}
                            onChange={(e) => handleFieldChange('addressType', e.target.value)}
                            className="w-full rounded border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A]"
                          >
                            <option value="Home">Home</option>
                            <option value="Office">Office</option>
                          </select>
                        </label>
                      </div>

                      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-end">
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="inline-flex items-center justify-center rounded border border-slate-300 bg-white px-6 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                        >
                          CANCEL
                        </button>
                        <button
                          type="button"
                          onClick={handleSaveAddress}
                          className="inline-flex items-center justify-center rounded bg-[#EA580C] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#C2410C]"
                        >
                          SAVE ADDRESS
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {isLoadingAddresses ? (
                      <div className="animate-pulse space-y-3">
                        <div className="h-24 w-full rounded-xl bg-slate-200"></div>
                        <div className="h-24 w-full rounded-xl bg-slate-200"></div>
                      </div>
                    ) : addresses.length === 0 ? (
                      <div className="text-center py-8 rounded-xl border border-slate-200 bg-white">
                        <p className="text-sm text-slate-500 mb-4">No addresses found.</p>
                        <button type="button" onClick={handleBeginEdit} className="text-sm font-bold text-[#1E3A8A] hover:underline">
                          + Add a new address
                        </button>
                      </div>
                    ) : (
                      <>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Default Address</p>
                        <div className="space-y-4">
                          {addresses.map(addr => {
                            const isSelected = address?.id === addr.id;
                            return (
                              <div 
                                key={addr.id} 
                                className={`rounded-xl bg-white p-5 transition-all cursor-pointer ${isSelected ? 'border-2 border-[#1E3A8A] shadow-sm' : 'border border-slate-200 hover:border-slate-300'}`}
                                onClick={() => {
                                  setAddress(addr);
                                  setAddressErrors({});
                                }}
                              >
                                <div className="flex items-start gap-4">
                                  <div className="mt-0.5 shrink-0">
                                    <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${isSelected ? 'border-[#1E3A8A]' : 'border-slate-300'}`}>
                                      {isSelected && <div className="h-2.5 w-2.5 rounded-full bg-[#1E3A8A]" />}
                                    </div>
                                  </div>
                                  
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-2">
                                      <span className="text-[15px] font-bold text-[#0F172A]">{addr.name}</span>
                                      <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 tracking-wider uppercase">{addr.addressType}</span>
                                    </div>
                                    <p className="text-[13px] text-slate-500 leading-relaxed max-w-xl">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}</p>
                                    <p className="text-[13px] text-slate-500 leading-relaxed">{addr.city}, {addr.state} - {addr.pincode}</p>
                                    <p className="mt-2 text-[13px] text-slate-700 font-medium">Mobile: <span className="font-bold">{addr.phone}</span></p>
                                    
                                    <div className="mt-3 flex items-center gap-1.5 text-[12px] font-medium text-emerald-600">
                                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                                      Pay on Delivery available
                                    </div>
                                    
                                    <div className="mt-5 flex items-center gap-3">
                                      <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); handleDeleteAddress(addr.id); }}
                                        className="rounded border border-slate-200 px-4 py-1.5 text-[11px] font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                                      >
                                        REMOVE
                                      </button>
                                      <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); handleEditAddress(addr); }}
                                        className="rounded border border-slate-200 px-4 py-1.5 text-[11px] font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                                      >
                                        EDIT
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </section>

            <section>
              <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4 mt-6">
                <h2 className="text-[22px] font-bold text-[#0F172A]">Select Payment Method</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { value: 'online', label: 'UPI', subLabel: 'Google Pay, PhonePe, BHIM', disabled: false },
                  { value: 'cod', label: 'Cash on Delivery', subLabel: 'Pay at your doorstep', disabled: false },
                ].map((option) => (
                  <label
                    key={option.value}
                    onClick={() => !option.disabled && setPaymentMethod(option.value)}
                    className={`flex ${option.disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'} items-start gap-4 rounded-xl border p-5 transition-all ${paymentMethod === option.value ? 'border-2 border-[#1E3A8A] shadow-sm' : 'border-slate-200 hover:border-slate-300'}`}
                  >
                    <div className="mt-1 shrink-0">
                      <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${paymentMethod === option.value ? 'border-[#1E3A8A]' : 'border-slate-300'}`}>
                        {paymentMethod === option.value && <div className="h-2.5 w-2.5 rounded-full bg-[#1E3A8A]" />}
                      </div>
                    </div>
                    <div>
                      <span className="block text-[15px] font-bold text-[#0F172A]">{option.label}</span>
                      <span className="block mt-1 text-[13px] font-medium text-slate-500">{option.subLabel}</span>
                    </div>
                  </label>
                ))}
              </div>
            </section>
          </div>

          <aside>
            <section className="rounded border border-slate-200 bg-white p-6 shadow-sm sticky top-6">
              <h2 className="text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-6 border-b border-slate-100 pb-4">
                Price Details ({cartItems.length} Item{cartItems.length !== 1 ? 's' : ''})
              </h2>

              <div className="space-y-4 text-[14px] text-slate-700">
                <div className="flex justify-between">
                  <span>Total MRP</span>
                  <span className="font-semibold text-slate-900">{formatCurrency(subTotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between">
                    <span>Discount on MRP <span className="text-[10px] text-[#C2410C] font-bold cursor-pointer hover:underline ml-1">Know More</span></span>
                    <span className="font-semibold text-emerald-600">-{formatCurrency(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Platform Fee <span className="text-[10px] text-[#C2410C] font-bold cursor-pointer hover:underline ml-1">Know More</span></span>
                  <span className="font-semibold text-emerald-600">{deliveryCharge ? formatCurrency(deliveryCharge) : 'FREE'}</span>
                </div>
              </div>

              <div className="mt-6 border-t border-slate-200 pt-5">
                <div className="flex items-center justify-between text-[17px] font-extrabold text-[#0F172A]">
                  <span>Total Amount</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={!canPlaceOrder}
                className={`mt-6 w-full rounded px-4 py-3.5 text-[15px] font-bold text-white shadow-sm transition ${canPlaceOrder ? 'bg-[#C2410C] hover:bg-[#9A3412]' : 'cursor-not-allowed bg-slate-300'}`}
              >
                CONTINUE
              </button>

              {!canPlaceOrder && (
                <p className="mt-4 text-center text-[12px] font-medium text-slate-500">
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

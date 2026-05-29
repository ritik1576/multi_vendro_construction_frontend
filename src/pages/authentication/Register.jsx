import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Users, TrendingUp, ClipboardList, User, Mail, Phone, Loader2, ArrowRight, Building2, MapPin, FileDigit } from 'lucide-react';
import Navbar from '../../components/landing/Navbar';
import InputField from '../../components/auth/InputField';
import PasswordField from '../../components/auth/PasswordField';
import { registerRequest } from '../../redux/authActions';

const Register = () => {
  const [role, setRole] = useState('Customer');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    businessEmail: '',
    businessPhone: '',
    gstNumber: '',
    businessAddress: ''
  });

  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, isAuthenticated, error: authError } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // We handle the error directly in the UI now, no more alerts
  }, [authError]);

  const validate = () => {
    const newErrors = {};

    if (role === 'Customer') {
      if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
      
      if (!formData.email) {
        newErrors.email = 'Email Address is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email Address is invalid';
      }

      if (!formData.phone) {
        newErrors.phone = 'Phone Number is required';
      } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
        newErrors.phone = 'Valid 10-digit Phone Number is required';
      }
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (role === 'Vendor') {
      if (!formData.businessName.trim()) newErrors.businessName = 'Business Name is required';
      
      if (!formData.businessEmail) {
        newErrors.businessEmail = 'Business Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.businessEmail)) {
        newErrors.businessEmail = 'Business Email is invalid';
      }

      if (!formData.businessPhone) {
        newErrors.businessPhone = 'Business Phone is required';
      } else if (!/^\d{10}$/.test(formData.businessPhone.replace(/\D/g, ''))) {
        newErrors.businessPhone = 'Valid 10-digit Phone Number is required';
      }

      if (!formData.gstNumber.trim()) {
        newErrors.gstNumber = 'GST Number is required';
      } else if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formData.gstNumber.toUpperCase())) {
        newErrors.gstNumber = 'Invalid GST Format (e.g. 22AAAAA0000A1Z5)';
      }

      if (!formData.businessAddress.trim()) newErrors.businessAddress = 'Business Address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      dispatch(registerRequest({ ...formData, role }));
    }
  };

  return (
    <div className="h-screen flex flex-col font-sans overflow-hidden bg-[#0A1128]">
      <Navbar />
      
      {/* Main Section */}
      <main className="h-[calc(100vh-64px)] flex items-center justify-center px-4 lg:px-20 py-4 bg-[#0A1128]">
        <div className="max-w-[900px] w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center max-h-full">
          
          {/* Left Column - Features */}
          <div className="text-white hidden lg:block">
            <h1 className="text-[32px] md:text-[36px] font-extrabold tracking-tight leading-[1.1] mb-4">
              Unlock Wholesale <br/>
              Construction Supplies
            </h1>
            <p className="text-[14px] text-gray-400 mb-8 max-w-[380px] leading-snug">
              Create your free account to access exclusive B2B pricing and manage bulk orders efficiently.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-white/5 rounded-lg border border-white/10 shrink-0">
                  <Users className="h-5 w-5 text-[#EA580C]" strokeWidth={1.5} />
                </div>
                <div className="pt-0.5">
                  <h3 className="text-[14px] font-bold text-white mb-0.5">Direct Manufacturer Access</h3>
                  <p className="text-[13px] text-gray-400 leading-tight">Connect directly with top brands without middlemen.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-white/5 rounded-lg border border-white/10 shrink-0">
                  <TrendingUp className="h-5 w-5 text-[#EA580C]" strokeWidth={1.5} />
                </div>
                <div className="pt-0.5">
                  <h3 className="text-[14px] font-bold text-white mb-0.5">Volume Discounts</h3>
                  <p className="text-[13px] text-gray-400 leading-tight">Unlock custom pricing tiers for your projects.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-white/5 rounded-lg border border-white/10 shrink-0">
                  <ClipboardList className="h-5 w-5 text-[#EA580C]" strokeWidth={1.5} />
                </div>
                <div className="pt-0.5">
                  <h3 className="text-[14px] font-bold text-white mb-0.5">Smart Procurement</h3>
                  <p className="text-[13px] text-gray-400 leading-tight">Track orders, manage RFQs, and handle billing.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Register Form */}
          <div className="bg-white rounded-[8px] w-full max-w-[380px] mx-auto lg:ml-auto shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-6 flex-grow overflow-y-auto custom-scrollbar">
              <div className="mb-5 text-center">
                <h2 className="text-[22px] font-bold text-[#111827] tracking-tight mb-1">Create Account</h2>
                <p className="text-[13px] text-gray-500">Start sourcing better today</p>
              </div>

              {authError && (
                <div className="mb-4 p-3 rounded-[6px] bg-red-50 border border-red-200 text-[12px] text-red-600 font-medium">
                  {authError}
                </div>
              )}

              {/* Role Selector */}
              <div className="flex bg-[#f4f6fb] p-1 rounded-[6px] mb-5">
                <button
                  type="button"
                  onClick={() => { setRole('Customer'); setErrors({}); }}
                  className={`flex-1 py-1.5 text-[12px] font-bold rounded-[4px] transition-colors ${role === 'Customer' ? 'bg-white text-[#EA580C] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Customer
                </button>
                <button
                  type="button"
                  onClick={() => { setRole('Vendor'); setErrors({}); }}
                  className={`flex-1 py-1.5 text-[12px] font-bold rounded-[4px] transition-colors ${role === 'Vendor' ? 'bg-white text-[#EA580C] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Vendor
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                
                {/* Customer Specific Fields */}
                {role === 'Customer' && (
                  <>
                    <InputField
                      label="Full Name"
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="John Doe"
                      icon={User}
                      error={errors.fullName}
                    />

                    <InputField
                      label="Email Address"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@company.com"
                      icon={Mail}
                      error={errors.email}
                    />

                    <InputField
                      label="Phone Number"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 00000 00000"
                      icon={Phone}
                      error={errors.phone}
                    />
                  </>
                )}

                {/* Vendor Specific Fields */}
                {role === 'Vendor' && (
                  <>
                    <InputField
                      label="Business Name"
                      type="text"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleChange}
                      placeholder="Acme Corp"
                      icon={Building2}
                      error={errors.businessName}
                    />

                    <InputField
                      label="Business Email"
                      type="email"
                      name="businessEmail"
                      value={formData.businessEmail}
                      onChange={handleChange}
                      placeholder="contact@acme.com"
                      icon={Mail}
                      error={errors.businessEmail}
                    />

                    <InputField
                      label="Business Phone"
                      type="tel"
                      name="businessPhone"
                      value={formData.businessPhone}
                      onChange={handleChange}
                      placeholder="+91 00000 00000"
                      icon={Phone}
                      error={errors.businessPhone}
                    />

                    <InputField
                      label="GST Number"
                      type="text"
                      name="gstNumber"
                      value={formData.gstNumber}
                      onChange={handleChange}
                      placeholder="22AAAAA0000A1Z5"
                      icon={FileDigit}
                      error={errors.gstNumber}
                    />

                    <InputField
                      label="Business Address"
                      type="text"
                      name="businessAddress"
                      value={formData.businessAddress}
                      onChange={handleChange}
                      placeholder="123 Industrial Area, City"
                      icon={MapPin}
                      error={errors.businessAddress}
                    />
                  </>
                )}

                <PasswordField
                  label="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min. 8 characters"
                  error={errors.password}
                />

                <PasswordField
                  label="Confirm Password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Min. 8 characters"
                  error={errors.confirmPassword}
                />

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center py-2.5 px-4 rounded-[6px] text-[13px] font-bold text-white bg-[#EA580C] hover:bg-[#d04e0a] disabled:opacity-70 disabled:cursor-not-allowed transition-colors mt-4 shadow-sm"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create {role} Account
                      <ArrowRight className="ml-2 h-[16px] w-[16px]" strokeWidth={2} />
                    </>
                  )}
                </button>
              </form>
            </div>
            
            {/* Card Footer */}
            <div className="bg-[#f4f6fb] py-4 text-center border-t border-[#e5e7eb] shrink-0">
              <p className="text-[12px] text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="font-bold text-[#111827] hover:text-[#EA580C] border-b border-[#111827] pb-0.5">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register;

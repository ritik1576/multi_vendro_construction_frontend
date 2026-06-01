import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, ArrowRight, Loader2, LifeBuoy } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPasswordRequest } from '../../redux/authActions';
import Navbar from '../../components/landing/Navbar';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [validationError, setValidationError] = useState('');
  
  const dispatch = useDispatch();
  const { isLoading, error: authError, successMessage } = useSelector((state) => state.auth);

  // We consider it "sent" if we have a success message specifically from the forgot password flow
  // (In a more robust app, we'd clear this state on mount)
  const isSent = !!successMessage;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setValidationError('Email Address is required');
      return;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setValidationError('Email Address is invalid');
      return;
    }
    
    setValidationError('');
    dispatch(forgotPasswordRequest({ email }));
  };

  const InfraMartLogo = ({ className = "" }) => (
    <div className={`flex items-center justify-center gap-1 ${className}`}>
      <span className="text-[20px] font-extrabold tracking-tight flex items-center">
        <span className="text-primary-dark">Infra</span>
        <span className="text-[#EA580C]">Mart</span>
        <svg width="14" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-[#EA580C] ml-0.5">
          <path d="M12 2L22 22L12 17L2 22Z" />
        </svg>
      </span>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#f4f6fb]">
      <Navbar />
      
      {/* Main Section */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-8 relative">
        
        {/* Reset Password Card */}
        <div className="bg-white rounded-[8px] w-full max-w-[420px] shadow-sm border border-[#e5e7eb] p-8 md:p-10 z-10">
          
          <InfraMartLogo className="mb-6" />
          
          <div className="text-center mb-8">
            <h1 className="text-[24px] font-bold text-[#111827] tracking-tight mb-3">Reset Your Password</h1>
            <p className="text-[14px] text-gray-500 leading-relaxed px-2">
              Enter your registered email address and we'll send you a link to reset your password.
            </p>
          </div>

          {authError && !isSent && (
            <div className="mb-4 p-3 rounded-[6px] bg-red-50 border border-red-200 text-[12px] text-red-600 font-medium">
              {authError}
            </div>
          )}

          {!isSent ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Email Address */}
              <div>
                <label className="block text-[13px] font-bold text-[#111827] mb-1.5">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-[16px] w-[16px] text-gray-400" strokeWidth={2} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className={`block w-full pl-9 pr-3 py-2.5 bg-[#f8f9fc] border ${validationError ? 'border-red-500' : 'border-[#e5e7eb]'} rounded-[6px] text-[14px] text-gray-900 placeholder-gray-400 focus:ring-1 focus:ring-[#EA580C] focus:border-[#EA580C] focus:bg-white transition-colors`}
                  />
                </div>
                {validationError && <p className="mt-1 text-[12px] text-red-500 font-medium">{validationError}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center py-2.5 px-4 rounded-[6px] text-[14px] font-bold text-white bg-[#EA580C] hover:bg-[#d04e0a] disabled:opacity-70 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                    Sending Link...
                  </>
                ) : (
                  <>
                    Send Reset Link
                    <ArrowRight className="ml-2 h-[16px] w-[16px]" strokeWidth={2} />
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="text-center py-4">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <Mail className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Check your email</h3>
              <p className="text-sm text-gray-500 mb-6">
                {successMessage || `We have sent a password reset link to `} <strong>{email}</strong>.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="text-sm font-medium text-[#EA580C] hover:text-[#d04e0a]"
              >
                Try another email address
              </button>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-[#e5e7eb] text-center">
            <Link to="/login" className="inline-flex items-center text-[13px] font-bold text-[#EA580C] hover:text-[#d04e0a] transition-colors">
              <ArrowLeft className="mr-1.5 h-4 w-4" strokeWidth={2.5} />
              Back to Sign In
            </Link>
          </div>
        </div>

        {/* Page Footer */}
        <div className="mt-10 text-center flex flex-col items-center gap-5 z-10">
          <div className="flex items-center gap-2 text-[13px] text-gray-600 bg-white/60 backdrop-blur-sm px-5 py-2.5 rounded-full shadow-sm border border-gray-200/60">
            <LifeBuoy className="w-4 h-4 text-[#EA580C]" />
            <span>Having trouble?</span>
            <Link to="#" className="font-bold text-[#EA580C] hover:text-[#d04e0a] transition-colors">
              Contact Support
            </Link>
          </div>
          <div className="text-[12px] text-gray-400 font-medium">
            &copy; {new Date().getFullYear()} InfraMart Industrial Marketplace. All rights reserved.
          </div>
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;

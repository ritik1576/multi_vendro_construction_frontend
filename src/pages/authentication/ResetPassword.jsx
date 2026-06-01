import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Lock, Eye, EyeOff, ArrowLeft, RotateCcw, Loader2, AlertCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { resetPasswordRequest } from '../../redux/authActions';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const { token } = useParams(); // Extract secure token from URL
  const dispatch = useDispatch();
  const { isLoading, error: authError, successMessage } = useSelector((state) => state.auth);

  const calculateStrength = (pass) => {
    let score = 0;
    if (!pass) return { score: 0, text: '', color: 'bg-gray-200' };
    if (pass.length > 8) score += 1;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) score += 1;
    if (/\d/.test(pass) && /[^a-zA-Z\d]/.test(pass)) score += 1;
    
    if (score === 1) return { score: 1, text: 'Weak', color: 'bg-red-500' };
    if (score === 2) return { score: 2, text: 'Medium strength', color: 'bg-orange-500' };
    if (score === 3) return { score: 3, text: 'Strong', color: 'bg-green-500' };
    return { score: 0, text: 'Too short', color: 'bg-red-500' };
  };

  const strength = calculateStrength(formData.password);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    
    dispatch(resetPasswordRequest({ password: formData.password, token }));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
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
    <div 
      className="min-h-screen flex flex-col font-sans bg-[#f8f9fc]"
      style={{
        backgroundImage: `linear-gradient(to right, #f0f0f0 1px, transparent 1px), linear-gradient(to bottom, #f0f0f0 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }}
    >
      {/* Main Section */}
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-[8px] w-full max-w-[460px] shadow-sm border border-[#e5e7eb] p-8 md:p-10">
          
          <InfraMartLogo className="mb-8" />
          
          {!token ? (
            <div className="text-center py-6">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <h2 className="text-[20px] font-bold text-[#111827] mb-2">Invalid Reset Link</h2>
              <p className="text-[14px] text-gray-500 mb-6">
                The password reset link is invalid or missing the security token. Please request a new link.
              </p>
              <Link to="/forgot-password" className="inline-flex items-center justify-center py-2.5 px-4 rounded-[6px] text-[14px] font-bold text-white bg-[#EA580C] hover:bg-[#d04e0a] transition-colors">
                Request New Link
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h1 className="text-[24px] font-bold text-[#111827] tracking-tight mb-3">Create New Password</h1>
            <p className="text-[14px] text-gray-500 leading-relaxed px-4">
              Please enter your new password below. Make sure it's at least 8 characters long.
            </p>
          </div>

          {authError && (
            <div className="mb-4 p-3 rounded-[6px] bg-red-50 border border-red-200 text-[12px] text-red-600 font-medium">
              {authError}
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 rounded-[6px] bg-green-50 border border-green-200 text-[12px] text-green-600 font-medium">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* New Password */}
            <div>
              <label className="block text-[13px] font-bold text-[#111827] mb-1.5">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`block w-full pl-4 pr-10 py-2.5 bg-[#f8f9fc] border ${errors.password ? 'border-red-500' : 'border-[#e5e7eb]'} rounded-[6px] text-[14px] text-gray-900 placeholder-gray-400 focus:ring-1 focus:ring-[#EA580C] focus:border-[#EA580C] focus:bg-white transition-colors`}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? <EyeOff className="h-[16px] w-[16px] text-gray-400 hover:text-gray-600" strokeWidth={2} /> : <Eye className="h-[16px] w-[16px] text-gray-400 hover:text-gray-600" strokeWidth={2} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-[12px] text-red-500 font-medium">{errors.password}</p>}
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-[13px] font-bold text-[#111827] mb-1.5">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`block w-full pl-4 pr-10 py-2.5 bg-[#f8f9fc] border ${errors.confirmPassword ? 'border-red-500' : 'border-[#e5e7eb]'} rounded-[6px] text-[14px] text-gray-900 placeholder-gray-400 focus:ring-1 focus:ring-[#EA580C] focus:border-[#EA580C] focus:bg-white transition-colors`}
                />
                <button 
                  type="button" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? <EyeOff className="h-[16px] w-[16px] text-gray-400 hover:text-gray-600" strokeWidth={2} /> : <Eye className="h-[16px] w-[16px] text-gray-400 hover:text-gray-600" strokeWidth={2} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1 text-[12px] text-red-500 font-medium">{errors.confirmPassword}</p>}
            </div>

            {/* Password Strength */}
            {formData.password.length > 0 && (
              <div className="flex items-center gap-2 pt-1">
                <div className="flex gap-1 flex-1 max-w-[80px]">
                  <div className={`h-1.5 flex-1 rounded-full ${strength.score >= 1 ? strength.color : 'bg-gray-200'}`} />
                  <div className={`h-1.5 flex-1 rounded-full ${strength.score >= 2 ? strength.color : 'bg-gray-200'}`} />
                  <div className={`h-1.5 flex-1 rounded-full ${strength.score >= 3 ? strength.color : 'bg-gray-200'}`} />
                </div>
                <span className="text-[11px] font-medium text-gray-500">{strength.text}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center py-2.5 px-4 rounded-[6px] text-[14px] font-bold text-white bg-[#EA580C] hover:bg-[#d04e0a] disabled:opacity-70 disabled:cursor-not-allowed transition-colors mt-6 shadow-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                  Resetting...
                </>
              ) : (
                <>
                  Reset Password
                  <RotateCcw className="ml-2 h-[16px] w-[16px]" strokeWidth={2.5} />
                </>
              )}
            </button>
          </form>
          </>
          )}

          <div className="mt-8 text-center">
            <Link to="/login" className="inline-flex items-center text-[13px] font-bold text-[#111827] hover:text-[#EA580C] transition-colors">
              <ArrowLeft className="mr-1.5 h-4 w-4" strokeWidth={2.5} />
              Back to Login
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-[#e5e7eb] py-6 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-[12px] text-gray-500">
            &copy; {new Date().getFullYear()} InfraMart Industrial Marketplace. All rights reserved.
          </div>
          <div className="flex items-center gap-6 text-[12px] font-medium text-gray-500">
            <Link to="#" className="hover:text-[#EA580C] transition-colors">Terms of Service</Link>
            <Link to="#" className="hover:text-[#EA580C] transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ResetPassword;

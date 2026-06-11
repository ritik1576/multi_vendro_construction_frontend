import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/landing/Navbar';
import { Lock, Loader2, ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react';

const AdminResetPassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        navigate('/admin/login', { replace: true });
      }, 1500);
    }
  };

  // Simple password strength indicator mock
  const getPasswordStrength = () => {
    const length = formData.password.length;
    if (length === 0) return 0;
    if (length < 6) return 1;
    if (length < 8) return 2;
    if (length >= 8 && /[A-Z]/.test(formData.password) && /[0-9]/.test(formData.password)) return 4;
    return 3;
  };

  const strengthColors = ['bg-slate-200', 'bg-red-500', 'bg-amber-500', 'bg-emerald-400', 'bg-emerald-600'];
  const strengthText = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const strength = getPasswordStrength();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />
      <div className="flex-1 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-[#1E3A8A] rounded-xl flex items-center justify-center shadow-sm">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-extrabold text-[#0F172A] tracking-tight">InfraMart</span>
        </div>
        <h2 className="mt-2 text-center text-sm font-extrabold text-slate-500 uppercase tracking-widest">
          Create New Password
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm border border-slate-200 sm:rounded-2xl sm:px-10">
          
          <div className="text-center mb-6">
            <p className="text-sm font-medium text-slate-500">
              Please enter your new administrative password below.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-10 py-2.5 border ${errors.password ? 'border-red-300 ring-red-100' : 'border-slate-200'} rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#C2410C]/20 focus:border-[#C2410C] transition-colors font-medium text-slate-900`}
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {formData.password && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 flex gap-1 h-1.5">
                    {[1, 2, 3, 4].map(idx => (
                      <div key={idx} className={`flex-1 rounded-full ${strength >= idx ? strengthColors[strength] : 'bg-slate-200'}`} />
                    ))}
                  </div>
                  <span className={`text-[10px] font-extrabold uppercase tracking-wider ${strength > 2 ? 'text-emerald-600' : 'text-slate-500'}`}>
                    {strengthText[strength]}
                  </span>
                </div>
              )}
              {errors.password && <p className="mt-1.5 text-[11px] font-bold text-red-500">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2.5 border ${errors.confirmPassword ? 'border-red-300 ring-red-100' : 'border-slate-200'} rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#C2410C]/20 focus:border-[#C2410C] transition-colors font-medium text-slate-900`}
                  placeholder="Confirm new password"
                />
              </div>
              {errors.confirmPassword && <p className="mt-1.5 text-[11px] font-bold text-red-500">{errors.confirmPassword}</p>}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-extrabold text-white bg-[#C2410C] hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C2410C] disabled:opacity-70 transition-colors"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Resetting Password...
                  </>
                ) : (
                  <>
                    Save New Password <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
        </div>
      </div>
    </div>
  );
};

export default AdminResetPassword;

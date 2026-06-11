import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShieldCheck, FileText, Mail, Loader2, ArrowRight } from 'lucide-react';
import Navbar from '../../components/landing/Navbar';
import InputField from '../../components/auth/InputField';
import PasswordField from '../../components/auth/PasswordField';
import { loginRequest, clearAuthError } from '../../redux/authActions';


const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [selectedRole, setSelectedRole] = useState('customer');
  const [errors, setErrors] = useState({});
  const [loginSubmitted, setLoginSubmitted] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, isAuthenticated, error: authError, user } = useSelector((state) => state.auth);

  const successMessage = location.state?.successMessage;

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === 'vendor') {
        navigate('/vendor/dashboard', { replace: true });
      } else {
        navigate('/products', { replace: true });
      }
    }
  }, [isAuthenticated, navigate, user]);

  useEffect(() => {
    // We handle the error directly in the UI now, no more alerts
  }, [authError]);

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email Address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email Address is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
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
      setLoginSubmitted(true);
      dispatch(loginRequest({ ...formData, role: selectedRole }));
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
              Empowering Indian <br/>
              Industrial Growth
            </h1>
            <p className="text-[14px] text-gray-400 mb-8 max-w-[380px] leading-snug">
              Join India's most trusted digital ecosystem for construction and industrial procurement.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-white/5 rounded-lg border border-white/10 shrink-0">
                  <ShieldCheck className="h-5 w-5 text-[#EA580C]" strokeWidth={1.5} />
                </div>
                <div className="pt-0.5">
                  <h3 className="text-[14px] font-bold text-white mb-0.5">100% Genuine Products</h3>
                  <p className="text-[13px] text-gray-400 leading-tight">Directly sourced from authorized channels.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-white/5 rounded-lg border border-white/10 shrink-0">
                  <ShieldCheck className="h-5 w-5 text-[#EA580C]" strokeWidth={1.5} />
                </div>
                <div className="pt-0.5">
                  <h3 className="text-[14px] font-bold text-white mb-0.5">Verified Tier-1 Sellers</h3>
                  <p className="text-[13px] text-gray-400 leading-tight">Strictly vetted vendors for quality assurance.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-white/5 rounded-lg border border-white/10 shrink-0">
                  <FileText className="h-5 w-5 text-[#EA580C]" strokeWidth={1.5} />
                </div>
                <div className="pt-0.5">
                  <h3 className="text-[14px] font-bold text-white mb-0.5">GST Invoicing</h3>
                  <p className="text-[13px] text-gray-400 leading-tight">Compliant billing for all your business needs.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Login Form */}
          <div className="bg-white rounded-[8px] w-full max-w-[380px] mx-auto lg:ml-auto shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 md:p-8 flex-grow">
              <div className="mb-6 text-center">
                <h2 className="text-[22px] font-bold text-[#111827] tracking-tight mb-1.5">Welcome Back</h2>
                <p className="text-[13px] text-gray-500">Access India's largest industrial marketplace</p>
              </div>

              {successMessage && !authError && (
                <div className="mb-4 p-3 rounded-[6px] bg-emerald-50 border border-emerald-200 text-[12px] text-emerald-600 font-medium text-center">
                  {successMessage}
                </div>
              )}

              {authError && (
                <div className="mb-4 p-3 rounded-[6px] bg-red-50 border border-red-200 text-[12px] text-red-600 font-medium text-center">
                  {authError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Role Selection Toggle */}
                <div className="flex p-1 bg-slate-100 rounded-lg mb-6 border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('customer')}
                    className={`flex-1 py-2 text-[13px] font-bold rounded-md transition-all ${
                      selectedRole === 'customer'
                        ? 'bg-white text-[#EA580C] shadow-sm ring-1 ring-slate-200/50'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    Customer
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole('vendor')}
                    className={`flex-1 py-2 text-[13px] font-bold rounded-md transition-all ${
                      selectedRole === 'vendor'
                        ? 'bg-white text-[#EA580C] shadow-sm ring-1 ring-slate-200/50'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    Vendor
                  </button>
                </div>

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

                <PasswordField
                  label="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  error={errors.password}
                  showForgotPassword={true}
                  onForgotPasswordClick={() => navigate('/forgot-password')}
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
                      Signing In...
                    </>
                  ) : (
                    <>
                      Sign In to InfraMart
                      <ArrowRight className="ml-2 h-[16px] w-[16px]" strokeWidth={2} />
                    </>
                  )}
                </button>
              </form>
            </div>
            
            {/* Card Footer */}
            <div className="bg-[#f4f6fb] py-4 text-center border-t border-[#e5e7eb]">
              <p className="text-[12px] text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="font-bold text-[#111827] hover:text-[#EA580C] border-b border-[#111827] pb-0.5">
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;

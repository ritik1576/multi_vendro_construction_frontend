import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../../components/landing/Navbar';
import { Mail, Loader2, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

const AdminForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsSuccess(true);
      setIsLoading(false);
    }, 1200);
  };

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
          Password Recovery
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm border border-slate-200 sm:rounded-2xl sm:px-10">
          
          {isSuccess ? (
            <div className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">Recovery Link Sent</h3>
              <p className="text-sm font-medium text-slate-500">
                If an administrative account exists for <span className="font-bold text-slate-900">{email}</span>, a password reset link will be sent to it shortly.
              </p>
              <div className="pt-4">
                <Link 
                  to="/admin/login"
                  className="w-full flex justify-center items-center py-2.5 px-4 border border-slate-200 rounded-lg shadow-sm text-sm font-extrabold text-slate-700 bg-white hover:bg-slate-50 transition-colors"
                >
                  Return to Sign In
                </Link>
              </div>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              
              <div className="text-center mb-6">
                <p className="text-sm font-medium text-slate-500">
                  Enter your email address and we'll send you a link to reset your administrative password.
                </p>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
                  <span className="text-xs font-bold text-red-600">{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError('');
                    }}
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#C2410C]/20 focus:border-[#C2410C] transition-colors font-medium text-slate-900"
                    placeholder="admin@inframart.com"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-extrabold text-white bg-[#C2410C] hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C2410C] disabled:opacity-70 transition-colors"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Reset Link <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </button>
                <div className="text-center">
                  <Link to="/admin/login" className="text-xs font-extrabold text-slate-500 hover:text-slate-700 transition-colors">
                    Back to Sign In
                  </Link>
                </div>
              </div>
            </form>
          )}

        </div>
        </div>
      </div>
    </div>
  );
};

export default AdminForgotPassword;

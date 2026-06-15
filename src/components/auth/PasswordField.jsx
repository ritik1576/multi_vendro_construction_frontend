import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

const PasswordField = ({ label = "Password", name = "password", value, onChange, placeholder = "••••••••", error, showForgotPassword, onForgotPasswordClick, autoComplete = 'new-password' }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <label className="block text-[12px] font-bold text-[#111827]">{label}</label>
        {showForgotPassword && (
          <button type="button" onClick={onForgotPasswordClick} className="text-[11px] font-medium text-[#EA580C] hover:text-[#d04e0a]">
            Forgot Password?
          </button>
        )}
      </div>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Lock className="h-[16px] w-[16px] text-gray-400" strokeWidth={2} />
        </div>
        <input
          type={showPassword ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`block w-full pl-9 pr-9 py-2 bg-[#f4f6fb] border ${error ? 'border-red-500' : 'border-[#e5e7eb]'} rounded-[6px] text-[13px] text-gray-900 placeholder-gray-400 focus:ring-1 focus:ring-[#EA580C] focus:border-[#EA580C] focus:bg-white transition-colors`}
        />
        <button 
          type="button" 
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          {showPassword ? <EyeOff className="h-[16px] w-[16px] text-gray-400 hover:text-gray-600" strokeWidth={2} /> : <Eye className="h-[16px] w-[16px] text-gray-400 hover:text-gray-600" strokeWidth={2} />}
        </button>
      </div>
      {error && <p className="mt-0.5 text-[11px] text-red-500 font-medium">{error}</p>}
    </div>
  );
};

export default PasswordField;

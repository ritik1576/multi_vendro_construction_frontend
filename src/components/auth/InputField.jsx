import React from 'react';

const InputField = ({ label, type = "text", name, value, onChange, placeholder, icon: Icon, error, readOnly, className = '', autoComplete = 'off' }) => {
  return (
    <div>
      <label className="block text-[12px] font-bold text-[#111827] mb-1">{label}</label>
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-[16px] w-[16px] text-gray-400" strokeWidth={2} />
          </div>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          readOnly={readOnly}
          autoComplete={autoComplete}
          className={`block w-full ${Icon ? 'pl-9' : 'pl-3'} pr-3 py-2 bg-[#f4f6fb] border ${error ? 'border-red-500' : 'border-[#e5e7eb]'} rounded-[6px] text-[13px] text-gray-900 placeholder-gray-400 focus:ring-1 focus:ring-[#EA580C] focus:border-[#EA580C] focus:bg-white transition-colors ${className}`}
        />
      </div>
      {error && <p className="mt-0.5 text-[11px] text-red-500 font-medium">{error}</p>}
    </div>
  );
};

export default InputField;

import React from 'react';
import { formatFieldName } from '../utils/formatters';

export const DynamicField = ({ fieldKey, value, onChange }) => {
  const label = formatFieldName(fieldKey);
  const lowerKey = fieldKey.toLowerCase();

  let inputType = 'text';
  let isTextarea = false;

  if (lowerKey.includes('message') || lowerKey.includes('description')) {
    isTextarea = true;
  } else if (lowerKey.includes('email')) {
    inputType = 'email';
  } else if (lowerKey.includes('phone')) {
    inputType = 'tel';
  } else if (lowerKey.includes('url') || lowerKey.includes('website') || lowerKey.includes('logo')) {
    inputType = 'url';
  }

  const commonClasses = "w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[var(--color-primary-main)] focus:border-transparent transition-all outline-none";

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-bold text-[var(--color-customText-primary)]">
        {label} <span className="text-red-500">*</span>
      </label>
      {isTextarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(fieldKey, e.target.value)}
          required
          rows={3}
          className={`${commonClasses} resize-y min-h-[80px]`}
          placeholder={`Enter ${label}`}
        />
      ) : (
        <input
          type={inputType}
          value={value}
          onChange={(e) => onChange(fieldKey, e.target.value)}
          required
          className={commonClasses}
          placeholder={`Enter ${label}`}
        />
      )}
    </div>
  );
};

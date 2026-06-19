import React, { useState } from 'react';
import { X, Calendar, Percent, IndianRupee, Tag } from 'lucide-react';

export const CouponForm = ({ initialData = null, onClose, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState(initialData || {
    code: '',
    discountType: 'percentage', // percentage, fixed
    discountValue: '',
    minimumOrderAmount: '',
    maxDiscount: '',
    startDate: '',
    endDate: '',
    usageLimit: '',
    isActive: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-extrabold text-[#0F172A] flex items-center gap-2">
            <Tag className="h-5 w-5 text-[#1E3A8A]" />
            {initialData ? 'Edit Coupon' : 'Create New Coupon'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form id="couponForm" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Code & Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Coupon Code *</label>
                <input
                  type="text"
                  name="code"
                  required
                  placeholder="e.g. SUMMER24"
                  value={formData.code}
                  onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm uppercase outline-none focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A]"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Discount Type *</label>
                <select
                  name="discountType"
                  value={formData.discountType}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A]"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (₹)</option>
                </select>
              </div>
            </div>

            {/* Values */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-1">
                  Value * {formData.discountType === 'percentage' ? <Percent className="h-3 w-3" /> : <IndianRupee className="h-3 w-3" />}
                </label>
                <input
                  type="number"
                  name="discountValue"
                  required
                  min="0"
                  step="0.01"
                  value={formData.discountValue}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A]"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Min Order Amount</label>
                <input
                  type="number"
                  name="minimumOrderAmount"
                  min="0"
                  placeholder="Optional"
                  value={formData.minimumOrderAmount}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A]"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Max Discount</label>
                <input
                  type="number"
                  name="maxDiscount"
                  min="0"
                  placeholder={formData.discountType === 'fixed' ? 'N/A' : 'Optional'}
                  disabled={formData.discountType === 'fixed'}
                  value={formData.maxDiscount}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A] disabled:bg-slate-50 disabled:text-slate-400"
                />
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Valid From *
                </label>
                <input
                  type="datetime-local"
                  name="startDate"
                  required
                  value={formData.startDate ? formData.startDate.substring(0, 16) : ''}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A]"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Valid Until
                </label>
                <input
                  type="datetime-local"
                  name="endDate"
                  value={formData.endDate ? formData.endDate.substring(0, 16) : ''}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A]"
                />
              </div>
            </div>

            {/* Limits & Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Total Usage Limit</label>
                <input
                  type="number"
                  name="usageLimit"
                  min="0"
                  placeholder="Leave empty for unlimited"
                  value={formData.usageLimit}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A]"
                />
              </div>
              <div className="flex items-center gap-3 pt-6">
                <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                  <input 
                    type="checkbox" 
                    name="isActive" 
                    id="isActiveToggle" 
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 border-slate-300 appearance-none cursor-pointer transition-transform duration-200 ease-in-out"
                    style={{ transform: formData.isActive ? 'translateX(100%)' : 'translateX(0)', borderColor: formData.isActive ? '#10B981' : '#CBD5E1' }}
                  />
                  <label 
                    htmlFor="isActiveToggle" 
                    className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer transition-colors duration-200 ease-in-out ${formData.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`}
                  ></label>
                </div>
                <label className="text-sm font-bold text-slate-700 cursor-pointer" htmlFor="isActiveToggle">
                  Active Status
                </label>
              </div>
            </div>

          </form>
        </div>

        <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 rounded-b-xl">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="couponForm"
            disabled={isLoading}
            className="px-6 py-2.5 text-sm font-bold text-white bg-[#1E3A8A] hover:bg-[#152e63] rounded-lg transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading && <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>}
            {initialData ? 'Update Coupon' : 'Create Coupon'}
          </button>
        </div>
      </div>
    </div>
  );
};
